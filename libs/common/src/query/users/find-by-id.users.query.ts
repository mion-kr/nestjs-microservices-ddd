import { ReqId } from '../../domain';
import { ReqIdLoggingInterface } from '../../interface';

export class FindByIdUsersQuery implements ReqIdLoggingInterface {
  id: string;
  reqId: ReqId;

  constructor(params: { id: string; reqId?: ReqId }) {
    const { id, reqId } = params ?? {};
    this.id = id;
    this.reqId = reqId;
  }
}
