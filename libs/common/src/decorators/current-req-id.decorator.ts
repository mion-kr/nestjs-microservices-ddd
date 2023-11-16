import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { ReqId } from '../domain';

const getCurrentReqIdByContext = (context: ExecutionContext): ReqId => {
  const reqId = context.switchToHttp().getRequest().id;
  return ReqId.of(reqId);
};

export const CurrentReqId = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentReqIdByContext(context),
);
