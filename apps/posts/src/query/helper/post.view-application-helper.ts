import { FindByIdsUsersQuery, ReqId } from '@app/common';
import { QueryBus } from '@nestjs/cqrs';
import { PostView } from '../domain/post.view-entity';

export class PostViewApplicationHelper {
  /**
   * 좋아요한 사용자 정보 추가
   * @param datas
   * @param query
   */
  static async setLikeUser(
    datas: PostView[],
    query: { reqId: ReqId },
    queryBus: QueryBus,
  ) {
    const likeUsers = new Set<string>();
    datas.map((data) => data.likeUserIds.map((id) => likeUsers.add(id)));

    const users = await queryBus.execute<FindByIdsUsersQuery>(
      new FindByIdsUsersQuery({
        userIdsValue: Array.from(likeUsers),
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
