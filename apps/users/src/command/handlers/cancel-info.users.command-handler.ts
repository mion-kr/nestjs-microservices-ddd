import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserId } from '../../../../../libs/common/src/cqrs/command/users/user.id';
import { NotFoundUsersException } from '../../exception/not-found.users.exception';
import { UserRepositoryImpl } from '../../infra/user.repository.impl';
import { UserRepository } from '../domain/repository/user.repository';
import { CancelUsersCommand } from '../impl/cancel.users.command';

@CommandHandler(CancelUsersCommand)
export class CancelUsersCommandHandler
  implements ICommandHandler<CancelUsersCommand>
{
  private readonly userRepository: UserRepository;

  constructor(userRepositoryImpl: UserRepositoryImpl) {
    this.userRepository = userRepositoryImpl;
  }

  async execute(command: CancelUsersCommand): Promise<UserId> {
    try {
      const userId = UserId.of({ id: command.idValue });

      const user = await this.userRepository.findById(userId);
      if (!user) throw new NotFoundUsersException();

      user.cancel();

      await this.userRepository.save(user);

      user.commit();

      return userId;
    } catch (error) {
      if (error instanceof NotFoundUsersException) throw error;

      throw new Error(`사용자 탈퇴 작업 중 오류가 발생 하였습니다.`);
    }
  }
}
