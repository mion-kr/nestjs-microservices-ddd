import { FindByIdsUsersQuery, UserId } from '@app/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserViewRepositoryImpl } from '../../infra/user.view-repository.impl';
import { UserViewRepository } from '../domain/user.view-repository';

@QueryHandler(FindByIdsUsersQuery)
export class FindByIdsUsersQueryHandler
  implements IQueryHandler<FindByIdsUsersQuery>
{
  private readonly userRepository: UserViewRepository;

  constructor(userViewRepositoryImpl: UserViewRepositoryImpl) {
    this.userRepository = userViewRepositoryImpl;
  }

  async execute(query: FindByIdsUsersQuery): Promise<any> {
    return await this.userRepository.findByIds(
      query.ids.map((id) => UserId.of({ id })),
    );
  }
}
