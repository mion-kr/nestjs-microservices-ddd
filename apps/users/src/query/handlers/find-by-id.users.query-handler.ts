import { FindByIdUsersQuery, UserId } from '@app/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserViewRepositoryImpl } from '../../infra/user.view-repository.impl';
import { UserViewRepository } from '../domain/user.view-repository';

@QueryHandler(FindByIdUsersQuery)
export class FindByIdUsersQueryHandler
  implements IQueryHandler<FindByIdUsersQuery>
{
  private readonly userRepository: UserViewRepository;

  constructor(userViewRepositoryImpl: UserViewRepositoryImpl) {
    this.userRepository = userViewRepositoryImpl;
  }

  async execute(query: FindByIdUsersQuery): Promise<any> {
    return await this.userRepository.findById(UserId.of(query));
  }
}
