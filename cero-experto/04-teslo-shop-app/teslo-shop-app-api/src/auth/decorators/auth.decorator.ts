import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from '../enums';
import { RolesProtected } from './get-roles-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';

export function Auth(...roles: Roles[]) {
  return applyDecorators(
    RolesProtected(...roles),
    UseGuards(
      AuthGuard(),
      UserRoleGuard,
    ),
  );
}