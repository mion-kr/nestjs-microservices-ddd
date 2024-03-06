import { FindByIdsUsersQuery, ReqId } from '@app/common';
import { QueryBus } from '@nestjs/cqrs';
import { PostView } from '../domain/post.view-entity';

export class PostViewApplicationHelper {
  /**
   * 사용자 정보 추가
   * @param datas
   * @param query
   * @param queryBus
   */
  static async setWriter(
    datas: PostView[],
    query: { reqId: ReqId },
    queryBus: QueryBus,
  ) {
    const writerIds = datas.map((data) => data.writerId);

    const users = await queryBus.execute<FindByIdsUsersQuery>(
      new FindByIdsUsersQuery({
        userIdsValue: writerIds,
        reqId: query.reqId,
      }),
    );

    datas.map((data) => {
      const writer = users.find((user) => user.id === data.writerId);
      data.setWriter(writer);
    });
  }
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
    datas.map((data) => data.likeUserIds?.map((id) => likeUsers.add(id)));

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
