import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetRequestsHeaders = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.rawHeaders;
  }
)