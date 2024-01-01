import { ReqId } from '@app/common';
import { Type } from 'class-transformer';
import { ReqIdLoggingInterface } from '../../../../interface';

export class FindByIdsUsersQuery implements ReqIdLoggingInterface {
  ids: string[];

  @Type(() => ReqId)
  reqId: ReqId;

  constructor(params: { userIdsValue: string[]; reqId?: ReqId }) {
    const { userIdsValue, reqId } = params ?? {};
    this.ids = userIdsValue;
    this.reqId = reqId;
  }
}
