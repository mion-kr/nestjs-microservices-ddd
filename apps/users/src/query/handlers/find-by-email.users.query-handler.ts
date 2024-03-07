import { FindByEmailUsersQuery } from '@app/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserViewRepositoryImpl } from '../../infra/user.view-repository.impl';
import { UserView } from '../domain/user.view-entity';
import { UserViewRepository } from '../domain/user.view-repository';

@QueryHandler(FindByEmailUsersQuery)
export class FindByEmailUsersQueryHandler
  implements IQueryHandler<FindByEmailUsersQuery>
{
  private readonly userRepository: UserViewRepository;

  constructor(userViewRepositoryImpl: UserViewRepositoryImpl) {
    this.userRepository = userViewRepositoryImpl;
  }

  async execute(query: FindByEmailUsersQuery): Promise<UserView> {
    return await this.userRepository.findByEmail(query.email);
  }
}
