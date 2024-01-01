import { ReqId } from '@app/common';
import { Type } from 'class-transformer';
import { ReqIdLoggingInterface } from '../../../../interface';

export class FindByIdUsersQuery implements ReqIdLoggingInterface {
  id: string;

  @Type(() => ReqId)
  reqId: ReqId;

  constructor(params: { userIdValue: string; reqId?: ReqId }) {
    const { userIdValue, reqId } = params ?? {};

    this.id = userIdValue;
    this.reqId = reqId;
  }
}
