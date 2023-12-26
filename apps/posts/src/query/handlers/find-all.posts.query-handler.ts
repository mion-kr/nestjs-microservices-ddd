import { FindByIdsUsersQuery } from '@app/common';
import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { PostViewRepositoryImpl } from '../../infra/post.view-repository.impl';
import { PostView } from '../domain/post.view-entity';
import { PostViewRepository } from '../domain/post.view-repository';
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

    await this.setLikeUsers(datas, query);

    return [datas, count];
  }

  private async setLikeUsers(datas: PostView[], query: FindAllPostsQuery) {
    const likeUsers = new Set<string>();
    datas.map((data) => data.likeUserIds.map((id) => likeUsers.add(id)));

    const users = await this.queryBus.execute<FindByIdsUsersQuery>(
      new FindByIdsUsersQuery({
        ids: Array.from(likeUsers),
        reqId: query.reqId,
      }),
    );

    datas.map((data) => {
      const likeUsers = users.filter((user) =>
        data.likeUserIds.includes(user.id),
      );

      data.setLikeUsers(likeUsers);
    });
  }
}
