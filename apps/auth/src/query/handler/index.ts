import { FindByEmailUsersQueryHandler } from './find-by-email.users.query-handler';
import { FindByIdUsersQueryHandler } from './find-by-id.users.query-handler';
import { UserMatchPasswordQueryHandler } from './user-match-password.query-handler';

export const QueryHandlers = [
  UserMatchPasswordQueryHandler,
  FindByEmailUsersQueryHandler,
  FindByIdUsersQueryHandler,
];
