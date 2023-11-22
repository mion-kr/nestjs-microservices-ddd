import { FindByEmailUsersQueryHandler } from './find-by-email.users.query-handler';
import { FindByIdUsersQueryHandler } from './find-by-id.users.query-handler';
import { FindByNicknameUsersQueryHandler } from './find-by-nickname.users.query-handler';
import { MatchPasswordUserQueryHandler } from './match-password.user.command-handler';

export const QueryHandlers = [
  FindByIdUsersQueryHandler,
  FindByEmailUsersQueryHandler,
  FindByNicknameUsersQueryHandler,
  MatchPasswordUserQueryHandler,
];
