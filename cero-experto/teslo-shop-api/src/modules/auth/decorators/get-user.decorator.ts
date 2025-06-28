import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from 'src/modules/users/entities/user.entity';

export const GetUser = createParamDecorator((data: string, ctx: ExecutionContext): User | string => {
  const req: Express.Request = ctx.switchToHttp().getRequest();
  const user = req.user as User;

  if (!user)
    throw new InternalServerErrorException(
      'User not found in request, please check the authentication guard.',
    );
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  if (data) return user[data];
  return user;
});
