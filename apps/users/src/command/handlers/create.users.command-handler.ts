import {
  CommandHandler,
  EventPublisher,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import * as dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { FindByEmailUsersQuery } from '../../../../../libs/common/src/query/user/find-by-email.users.query';
import { CreatedUserEvent } from '../../event/impl/created.user.event';
import { NotFoundUserException } from '../../exception/not-found-user.exception';
import { UserRepositoryImpl } from '../../infra/user.repository.impl';
import { FindByNicknameUsersQuery } from '../../query/impl/find-by-nickname.users.query';
import { User } from '../domain/entities/user.entity';
import { UserId } from '../domain/entities/user.id';
import { UserRepository } from '../domain/repository/user.repository';
import { CreateUsersCommand } from '../impl/create.users.command';

@CommandHandler(CreateUsersCommand)
export class CreateCommandHandler
  implements ICommandHandler<CreateUsersCommand>
{
  private readonly userRepository: UserRepository;

  constructor(
    userRepositoryImpl: UserRepositoryImpl,
    private readonly queryBus: QueryBus,
    private readonly eventPublisher: EventPublisher,
  ) {
    this.userRepository = userRepositoryImpl;
  }

  async execute(command: CreateUsersCommand): Promise<UserId> {
    await this.validate(command);

    const user = await this.createUser(command);

    await this.userRepository.save(user);

    this.publishEvent(user);

    return user.getId();
  }

  /**
   * 논리 유효성 검사
   * @param command
   */
  private async validate(command: CreateUsersCommand) {
    // 이메일 중복 검사
    try {
      const savedEmail = await this.queryBus.execute<FindByEmailUsersQuery>(
        new FindByEmailUsersQuery(command),
      );
      if (savedEmail) throw new Error('이미 가입된 이메일입니다.');
    } catch (error) {
      if (!(error instanceof NotFoundUserException)) throw error;
    }

    // 닉네임 중복 검사
    try {
      const savedNickname =
        await this.queryBus.execute<FindByNicknameUsersQuery>(
          new FindByNicknameUsersQuery(command),
        );
      if (savedNickname) throw new Error('이미 사용중인 닉네임입니다.');
    } catch (error) {
      if (!(error instanceof NotFoundUserException)) throw error;
    }
  }

  /**
   * 유저 객체 생성
   * @param command
   * @returns
   */
  private async createUser(command: CreateUsersCommand) {
    const id = nanoid();

    const user = this.eventPublisher.mergeObjectContext(
      await User.create({
        ...command,
        id: UserId.create({ id }),
        createBy: id,
        createdAt: dayjs(),
      }),
    );
    return user;
  }

  /**
   * 이벤트 발생
   * @param user
   */
  private publishEvent(user: User) {
    /* 사용자 가입 완료 이벤트 발행. 근데 동기로 진행되네??
     * => 결국 비동기로 실행되는데, 디버그 포인트 찍으면 동기처럼 실행되는 것처럼 보임
     */

    user.apply(new CreatedUserEvent(user.getId()));
    user.commit();
  }
}
