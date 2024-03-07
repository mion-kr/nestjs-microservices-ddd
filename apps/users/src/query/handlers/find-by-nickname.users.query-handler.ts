import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserViewRepositoryImpl } from '../../infra/user.view-repository.impl';
import { UserViewRepository } from '../domain/user.view-repository';
import { FindByNicknameUsersQuery } from '../impl/find-by-nickname.users.query';

@QueryHandler(FindByNicknameUsersQuery)
export class FindByNicknameUsersQueryHandler
  implements IQueryHandler<FindByNicknameUsersQuery>
{
  private readonly userRepository: UserViewRepository;

  constructor(userViewRepositoryImpl: UserViewRepositoryImpl) {
    this.userRepository = userViewRepositoryImpl;
  }

  async execute(query: FindByNicknameUsersQuery): Promise<any> {
    return await this.userRepository.findByNickName(query.nickName);
  }
}
