import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user) return new HttpException('User not logged or not found in request', HttpStatus.UNAUTHORIZED);
    if (!data || data.trim().length === 0) return request.user;
    return request.user[data];
  }
)