import { UserMatchPasswordQuery } from '@app/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../command/domain/repository/user.repository';
import { NotFoundUsersException } from '../../exception/not-found.users.exception';
import { UserRepositoryImpl } from '../../infra/user.repository.impl';

@QueryHandler(UserMatchPasswordQuery)
export class MatchPasswordUserQueryHandler
  implements IQueryHandler<UserMatchPasswordQuery>
{
  private userRepository: UserRepository;

  constructor(userRepositoryImpl: UserRepositoryImpl) {
    this.userRepository = userRepositoryImpl;
  }

  async execute(command: UserMatchPasswordQuery): Promise<boolean> {
    const user = await this.userRepository.findByEmail(command.email);
    if (!user) throw new NotFoundUsersException();
    return await user.isMatchPassword(command.password);
  }
}
