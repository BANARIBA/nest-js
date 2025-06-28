import { SetMetadata } from '@nestjs/common';
import { UserRoles } from 'src/modules/users/enums/roles.enum';

export const MetaRoles: string = 'ROLES';

export const RoleProtected = (...args: UserRoles[]) => {
  return SetMetadata(MetaRoles, args);
};
