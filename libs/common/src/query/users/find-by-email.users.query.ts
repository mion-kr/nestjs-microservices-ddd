import { ReqId } from '../../domain';

export class FindByEmailUsersQuery {
  email: string;
  reqId: ReqId;

  constructor(params: { email: string; reqId?: ReqId }) {
    this.email = params.email;
    this.reqId = params?.reqId;
  }
}
