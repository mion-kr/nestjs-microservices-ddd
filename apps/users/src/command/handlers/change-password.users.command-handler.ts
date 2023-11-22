import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IsNotMatchPasswordException } from '../../exception/is-not-match-password.exception';
import { NotFoundUserException } from '../../exception/not-found-user.exception';
import { UserRepositoryImpl } from '../../infra/user.repository.impl';
import { UserId } from '../domain/entities/user.id';
import { UserRepository } from '../domain/repository/user.repository';
import { ChangePasswordUsersCommand } from '../impl/change-password.users.command';

@CommandHandler(ChangePasswordUsersCommand)
export class ChangePasswordUsersCommandHandler
  implements ICommandHandler<ChangePasswordUsersCommand>
{
  private readonly userRepository: UserRepository;

  constructor(userRepositoryImpl: UserRepositoryImpl) {
    this.userRepository = userRepositoryImpl;
  }

  async execute(command: ChangePasswordUsersCommand): Promise<UserId> {
    try {
      const userId = UserId.create({ id: command.idValue });

      const user = await this.userRepository.findById(userId);
      if (!user) throw new NotFoundUserException();

      await user.changePassword(command);

      await this.userRepository.save(user);

      return userId;
    } catch (error) {
      if (error instanceof NotFoundUserException) throw error;
      if (error instanceof IsNotMatchPasswordException) throw error;

      throw new Error(`비밀번호 변경 작업 중 오류가 발생 하였습니다.`);
    }
  }
}
