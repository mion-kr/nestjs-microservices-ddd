import { FindByIdUsersQuery, UserId } from '@app/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserViewRepositoryImpl } from '../../infra/user.view-repository.impl';
import { UserViewRepository } from '../domain/user.view-repository';

@QueryHandler(FindByIdUsersQuery)
export class FindByIdUsersQueryHandler
  implements IQueryHandler<FindByIdUsersQuery>
{
  private readonly userRepository: UserViewRepository;

  // view 관련 쿼리는 단순화를 위해 prisma에 바로 의존하도록 합니다. 도메인이 반드시 필요할 경우만 도메인을 사용합니다.
  constructor(userViewRepositoryImpl: UserViewRepositoryImpl) {
    this.userRepository = userViewRepositoryImpl;
  }

  async execute(query: FindByIdUsersQuery): Promise<any> {
    return await this.userRepository.findById(UserId.of(query));
  }
}
