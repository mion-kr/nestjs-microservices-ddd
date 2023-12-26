import { ReqId, ReqIdLoggingInterface } from '@app/common';

export class FindOnePostsQuery implements ReqIdLoggingInterface {
  postId: string;
  reqId: ReqId;

  constructor(params: { postId: string; reqId: ReqId }) {
    this.postId = params.postId;
    this.reqId = params.reqId;
  }
}
