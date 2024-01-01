import { ReqId } from '@app/common';
import { Type } from 'class-transformer';
import { ReqIdLoggingInterface } from '../../../interface/req-id.logging.interface';

export class LoginUserEvent implements ReqIdLoggingInterface {
  id: string;

  @Type(() => ReqId)
  reqId: ReqId;

  constructor(params: { userId: string; reqId: ReqId }) {
    const { userId: id, reqId } = params ?? {};
    this.id = id;
    this.reqId = reqId;
  }
}
