import { isObject } from '@nestjs/common/utils/shared.utils';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundUserException } from '../../exception/not-found-user.exception';
import { UserRepositoryImpl } from '../../infra/user.repository.impl';
import { UserId } from '../domain/entities/user.id';
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
    const userId = UserId.create({ id: command.idValue });
    const user = await this.userRepository.findById(userId);
    if (!isObject(user)) throw new NotFoundUserException();

    user.updateLastLoginDate();

    this.userRepository.save(user);
  }
}
