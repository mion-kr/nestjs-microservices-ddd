import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserView } from '../domain';

const getCurrentUserByContext = (context: ExecutionContext): UserView => {
  const { password, ...user } = context.switchToHttp().getRequest().user;
  return user;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
