import { ReqId, ReqIdLoggingInterface } from '@app/common';
import { PostId } from '../../command/domain/entities/post.id';

export class FindOnePostsQuery implements ReqIdLoggingInterface {
  id: PostId;
  reqId: ReqId;

  constructor(params: { postId: string; reqId: ReqId }) {
    this.id = PostId.of({ id: params.postId });
    this.reqId = params.reqId;
  }
}
