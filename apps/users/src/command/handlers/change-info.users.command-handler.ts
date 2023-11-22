import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundUserException } from '../../exception/not-found-user.exception';
import { UserRepositoryImpl } from '../../infra/user.repository.impl';
import { UserId } from '../domain/entities/user.id';
import { UserRepository } from '../domain/repository/user.repository';
import { ChangeInfoUsersCommand } from '../impl/change-info.users.command';

@CommandHandler(ChangeInfoUsersCommand)
export class ChangeInfoUsersCommandHandler
  implements ICommandHandler<ChangeInfoUsersCommand>
{
  private readonly userRepository: UserRepository;

  constructor(userRepositoryImpl: UserRepositoryImpl) {
    this.userRepository = userRepositoryImpl;
  }

  async execute(command: ChangeInfoUsersCommand): Promise<UserId> {
    try {
      const userId = UserId.create({ id: command.idValue });

      const user = await this.userRepository.findById(userId);
      if (!user) throw new NotFoundUserException();

      user.changeInfo(command);

      await this.userRepository.save(user);

      return userId;
    } catch (error) {
      if (error instanceof NotFoundUserException) throw error;

      throw new Error(`사용자 정보 변경 작업 중 오류가 발생 하였습니다.`);
    }
  }
}
