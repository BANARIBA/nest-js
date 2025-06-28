import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'src/modules/users/entities/user.entity';
import { MetaRoles } from '../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(
      MetaRoles,
      context.getHandler(),
    );

    // Significa que todo usuario se le permitira entrar a la ruta
    if (!validRoles || validRoles.length === 0) return true;

    const request: Express.Request = context.switchToHttp().getRequest();
    const user = request.user as User;

    if (!user) throw new UnauthorizedException('User not logged or not found.');

    for (const role of user.roles) {
      if (validRoles.includes(role)) {
        return true;
      }
    }

    throw new UnauthorizedException(
      `${user.fullName} needs a valid roles: ${validRoles.join(',')}`,
    );
  }
}
