import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { PostViewRepositoryImpl } from '../../infra/post.view-repository.impl';
import { PostViewRepository } from '../domain/post.view-repository';
import { PostViewApplicationHelper } from '../helper/post.view-application-helper';
import { FindOnePostsQuery } from '../impl/find-one.posts.query';

@QueryHandler(FindOnePostsQuery)
export class FindOnePostsQueryHandler
  implements IQueryHandler<FindOnePostsQuery>
{
  private readonly postViewRepository: PostViewRepository;

  constructor(
    postViewRepositoryImpl: PostViewRepositoryImpl,
    private readonly queryBus: QueryBus,
  ) {
    this.postViewRepository = postViewRepositoryImpl;
  }

  async execute(query: FindOnePostsQuery): Promise<any> {
    const data = await this.postViewRepository.findById(query.id);

    await PostViewApplicationHelper.setWriter([data], query, this.queryBus);
    await PostViewApplicationHelper.setLikeUser([data], query, this.queryBus);

    return data;
  }
}
