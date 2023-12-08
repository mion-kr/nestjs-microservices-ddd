import { UserMatchPasswordQuery } from '@app/common';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../command/domain/repository/user.repository';
import { NotFoundUserException } from '../../exception/not-found-user.exception';
import { UserRepositoryImpl } from '../../infra/user.repository.impl';

@QueryHandler(UserMatchPasswordQuery)
export class MatchPasswordUserQueryHandler
  implements IQueryHandler<UserMatchPasswordQuery>
{
  private readonly logger: Logger = new Logger(
    MatchPasswordUserQueryHandler.name,
  );
  private userRepository: UserRepository;

  constructor(userRepositoryImpl: UserRepositoryImpl) {
    this.userRepository = userRepositoryImpl;
  }

  async execute(command: UserMatchPasswordQuery): Promise<boolean> {
    const user = await this.userRepository.findByEmail(command.email);
    if (!user) throw new NotFoundUserException();
    return await user.isMatchPassword(command.password);
  }
}
