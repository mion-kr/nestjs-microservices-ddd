import { Response } from 'express';
import { UserView } from '../../../../../libs/common/src';

export class CreateUserJwtTokenCommand {
  user: UserView;
  response: Response;

  constructor(params: { user: UserView; response: Response }) {
    this.user = params.user;
    this.response = params.response;
  }
}
