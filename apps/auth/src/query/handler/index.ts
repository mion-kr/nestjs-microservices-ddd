import {
  FindByEmailUsersQueryHandler,
  FindByIdUsersQueryHandler,
} from '@app/common';
import { UserMatchPasswordQueryHandler } from './user-match-password.query-handler';

export const QueryHandlers = [
  UserMatchPasswordQueryHandler,
  FindByEmailUsersQueryHandler,
  FindByIdUsersQueryHandler,
];
