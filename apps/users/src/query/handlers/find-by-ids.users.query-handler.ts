import { FindByIdsUsersQuery, UserId } from '@app/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserViewRepositoryImpl } from '../../infra/user.view-repository.impl';
import { UserViewRepository } from '../domain/user.view-repository';

@QueryHandler(FindByIdsUsersQuery)
export class FindByIdsUsersQueryHandler
  implements IQueryHandler<FindByIdsUsersQuery>
{
  private readonly userRepository: UserViewRepository;

  // view 관련 쿼리는 단순화를 위해 prisma에 바로 의존하도록 합니다. 도메인이 반드시 필요할 경우만 도메인을 사용합니다.
  constructor(userViewRepositoryImpl: UserViewRepositoryImpl) {
    this.userRepository = userViewRepositoryImpl;
  }

  async execute(query: FindByIdsUsersQuery): Promise<any> {
    return await this.userRepository.findByIds(
      query.ids.map((id) => UserId.of({ id })),
    );
  }
}
