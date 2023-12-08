import { ReqId } from '@app/common';
import { ReqIdLoggingInterface } from '../../../interface/req-id.logging.interface';

export class LoginUserEvent implements ReqIdLoggingInterface {
  id: string;
  reqId: ReqId;

  constructor(params: { id: string; reqId: ReqId }) {
    const { id, reqId } = params ?? {};
    this.id = id;
    this.reqId = reqId;
  }
}
