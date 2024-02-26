import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserId } from '../../../../../libs/common/src/cqrs/command/users/user.id';
import { NotFoundUserException } from '../../exception/not-found-user.exception';
import { UserRepositoryImpl } from '../../infra/user.repository.impl';
import { UserRepository } from '../domain/repository/user.repository';
import { UpdateUserLastLoginDateCommand } from '../impl/update-user-last-login-date.command';

@CommandHandler(UpdateUserLastLoginDateCommand)
export class UpdateUserLastLoginDateCommandHandler
  implements ICommandHandler<UpdateUserLastLoginDateCommand>
{
  private userRepository: UserRepository;

  constructor(userRepositoryImpl: UserRepositoryImpl) {
    this.userRepository = userRepositoryImpl;
  }
  async execute(command: UpdateUserLastLoginDateCommand): Promise<any> {
    const userId = UserId.of({ id: command.idValue });
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundUserException();

    await user.updateLastLoginDate();

    await this.userRepository.save(user);
  }
}
