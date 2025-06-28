import { SetMetadata } from "@nestjs/common";
import { AuthEnum, Roles } from "../enums";

export const RolesProtected = (...args: Roles[]) => {
  return SetMetadata(AuthEnum.META_ROLES, args);
}