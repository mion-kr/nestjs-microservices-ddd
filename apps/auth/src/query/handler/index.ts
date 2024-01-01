import {
  FindByEmailUsersCommonQueryHandler,
  FindByIdUsersCommonQueryHandler,
} from '@app/common';
import { UserMatchPasswordQueryHandler } from './user-match-password.query-handler';

export const QueryHandlers = [
  UserMatchPasswordQueryHandler,
  FindByEmailUsersCommonQueryHandler,
  FindByIdUsersCommonQueryHandler,
];
