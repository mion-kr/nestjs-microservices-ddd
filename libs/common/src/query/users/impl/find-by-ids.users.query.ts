import { ReqId } from '@app/common';
import { ReqIdLoggingInterface } from '../../../interface';

export class FindByIdsUsersQuery implements ReqIdLoggingInterface {
  ids: string[];
  reqId: ReqId;

  constructor(params: { ids: string[]; reqId?: ReqId }) {
    const { ids, reqId } = params ?? {};
    this.ids = ids;
    this.reqId = reqId;
  }
}
