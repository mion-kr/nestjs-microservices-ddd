import { CreateCommandHandler } from './create.users.command-handler';
import { MatchPasswordUserCommandHandler } from './match-password.user.command-handler';

export const CommandHandlers = [
  CreateCommandHandler,
  MatchPasswordUserCommandHandler,
];
