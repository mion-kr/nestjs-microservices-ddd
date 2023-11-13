import { FindByEmailUsersQueryHandler } from './find-by-email.users.query-handler';
import { FindByIdUsersQueryHandler } from './find-by-id.users.query-handler';
import { FindByNicknameUsersQueryHandler } from './find-by-nickname.users.query-handler';

export const QueryHandlers = [
  FindByIdUsersQueryHandler,
  FindByEmailUsersQueryHandler,
  FindByNicknameUsersQueryHandler,
];
