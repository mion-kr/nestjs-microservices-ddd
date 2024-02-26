import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { PostViewRepositoryImpl } from '../../infra/post.view-repository.impl';
import { PostViewRepository } from '../domain/post.view-repository';
import { PostViewApplicationHelper } from '../helper/post.view-application-helper';
import { FindAllPostsQuery } from '../impl/find-all.posts.query';

@QueryHandler(FindAllPostsQuery)
export class FindAllPostsQueryHandler
  implements IQueryHandler<FindAllPostsQuery>
{
  private readonly postViewRepository: PostViewRepository;

  constructor(
    postViewRepositoryImpl: PostViewRepositoryImpl,
    private readonly queryBus: QueryBus,
  ) {
    this.postViewRepository = postViewRepositoryImpl;
  }

  async execute(query: FindAllPostsQuery): Promise<any> {
    const [datas, count] = await this.postViewRepository.findAll(query);

    await PostViewApplicationHelper.setWriter(datas, query, this.queryBus);
    await PostViewApplicationHelper.setLikeUser(datas, query, this.queryBus);

    return [datas, count];
  }
}
