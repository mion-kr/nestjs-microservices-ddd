import { ReqId } from '../../domain';

export class FindByIdUsersQuery {
  id: string;
  reqId: ReqId;

  constructor(params: { id: string; reqId?: ReqId }) {
    this.id = params.id;
    this.reqId = params?.reqId;
  }
}
