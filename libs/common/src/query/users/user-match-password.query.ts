import { ReqId } from '../../domain';

export class UserMatchPasswordQuery {
  email: string;
  password: string;

  reqId: ReqId;

  constructor(params: { email: string; password: string; reqId?: ReqId }) {
    const { email, password, reqId } = params ?? {};
    this.email = email;
    this.password = password;
    this.reqId = reqId;
  }
}
