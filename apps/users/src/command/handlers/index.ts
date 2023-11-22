import { CancelUsersCommandHandler } from './cancel-info.users.command-handler';
import { ChangeInfoUsersCommandHandler } from './change-info.users.command-handler';
import { ChangePasswordUsersCommandHandler } from './change-password.users.command-handler';
import { CreateCommandHandler } from './create.users.command-handler';
import { UpdateUserLastLoginDateCommandHandler } from './update-user-last-login-date.command-handler';

export const CommandHandlers = [
  CreateCommandHandler,
  UpdateUserLastLoginDateCommandHandler,
  ChangeInfoUsersCommandHandler,
  ChangePasswordUsersCommandHandler,
  CancelUsersCommandHandler,
];
