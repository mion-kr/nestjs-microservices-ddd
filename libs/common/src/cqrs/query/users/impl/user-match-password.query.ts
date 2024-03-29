import { ReqId } from '@app/common';
import { Type } from 'class-transformer';
import { ReqIdLoggingInterface } from '../../../../interface';

export class UserMatchPasswordQuery implements ReqIdLoggingInterface {
  email: string;

  password: string;

  @Type(() => ReqId)
  reqId: ReqId;

  constructor(params: { email: string; password: string; reqId?: ReqId }) {
    const { email, password, reqId } = params ?? {};
    this.email = email;
    this.password = password;
    this.reqId = reqId;
  }
}
