import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthEnum } from 'src/auth/enums';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor (private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(AuthEnum.META_ROLES, context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    if (!user) throw new HttpException(`User not logged or not found`, HttpStatus.BAD_REQUEST);
    // console.log('UserRoleGuard: ', {validRoles, roles: user.roles})

    for (const role of user.roles) {
      if (validRoles.includes(role)) return true;
    }

    throw new HttpException(`User ${user.full_name} needs a valid role: ${validRoles.join(',')}`, HttpStatus.UNAUTHORIZED);
  }
}
