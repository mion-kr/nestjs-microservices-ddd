import { Response } from 'express';
import { IUserView } from '../../../../../libs/common/src';

export class CreateUserJwtTokenCommand {
  user: IUserView;
  response: Response;

  constructor(params: { user: IUserView; response: Response }) {
    this.user = params.user;
    this.response = params.response;
  }
}
