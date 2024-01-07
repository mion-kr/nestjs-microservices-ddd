import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { IUserView } from '../cqrs';

const getCurrentUserByContext = (context: ExecutionContext): IUserView => {
  const { password, ...user } = context.switchToHttp().getRequest().user;
  return user;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
