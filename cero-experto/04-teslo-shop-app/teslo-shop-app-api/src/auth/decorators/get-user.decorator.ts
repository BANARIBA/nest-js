import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (!request.user) return new HttpException(`User not logged or user not found`, HttpStatus.INTERNAL_SERVER_ERROR);
    if (!data || data.trim().length === 0) return request.user;
    return request.user[data];
  }
);