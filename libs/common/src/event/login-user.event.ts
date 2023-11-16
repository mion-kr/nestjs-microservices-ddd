import { ReqId } from '@app/common';

export class LoginUserEvent {
  id: string;
  reqId: ReqId;
  constructor(params: { id: string; reqId: ReqId }) {
    this.id = params.id;
    this.reqId = params.reqId;
  }
}
