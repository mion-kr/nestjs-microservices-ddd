import { ReqId, ReqIdLoggingInterface } from '@app/common';

export class FindAllPostsQuery implements ReqIdLoggingInterface {
  searchKeyword: string;
  page: number;
  size: number;
  reqId: ReqId;

  constructor(params: {
    searchKeyword: string;
    page: number;
    size: number;
    reqId: ReqId;
  }) {
    this.searchKeyword = params.searchKeyword;
    this.page = params.page;
    this.size = params.size;
    this.reqId = params.reqId;
  }
}
