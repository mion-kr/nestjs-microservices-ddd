import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepositoryImpl } from '../../infra/user.repository.impl';
import { UserRepository } from '../domain/repository/user.repository';
import { MatchPasswordUserCommand } from '../impl/match-password.user.command';

@CommandHandler(MatchPasswordUserCommand)
export class MatchPasswordUserCommandHandler
  implements ICommandHandler<MatchPasswordUserCommand>
{
  private userRepository: UserRepository;

  constructor(userRepositoryImpl: UserRepositoryImpl) {
    this.userRepository = userRepositoryImpl;
  }

  async execute(command: MatchPasswordUserCommand): Promise<boolean> {
    const user = await this.userRepository.findByEmail(command.email);
    return await user.matchPassword(command.password);
  }
}
