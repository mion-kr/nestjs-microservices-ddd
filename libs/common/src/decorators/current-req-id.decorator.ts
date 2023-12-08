import { ReqId } from '@app/common';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

const getCurrentReqIdByContext = (context: ExecutionContext): ReqId => {
  const reqId = context.switchToHttp().getRequest().id;
  return ReqId.of(reqId);
};

export const CurrentReqId = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentReqIdByContext(context),
);
