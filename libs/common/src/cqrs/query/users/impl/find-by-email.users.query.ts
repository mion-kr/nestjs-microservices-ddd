import { ReqId } from '@app/common';
import { ReqIdLoggingInterface } from '../../../../interface/req-id.logging.interface';

export class FindByEmailUsersQuery implements ReqIdLoggingInterface {
  email: string;
  reqId: ReqId;

  constructor(params: { email: string; reqId?: ReqId }) {
    const { email, reqId } = params ?? {};
    this.email = email;
    this.reqId = reqId;
  }
}
