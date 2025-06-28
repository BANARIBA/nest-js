import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetRawHeaders = createParamDecorator(
  (data: string, ctx: ExecutionContext): string[] => {
    const req: Express.Request = ctx.switchToHttp().getRequest();
    return req['rawHeaders'] as string[];
  },
);
