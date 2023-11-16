import { CreateCommandHandler } from './create.users.command-handler';
import { MatchPasswordUserCommandHandler } from './match-password.user.command-handler';
import { UpdateUserLastLoginDateCommandHandler } from './update-user-last-login-date.command-handler';

export const CommandHandlers = [
  CreateCommandHandler,
  MatchPasswordUserCommandHandler,
  UpdateUserLastLoginDateCommandHandler,
];
