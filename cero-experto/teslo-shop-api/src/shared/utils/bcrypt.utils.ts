import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

export const encryptParam = (param: string): string => {
  const salt = genSaltSync(10);
  return hashSync(param, salt);
};

export const isMatchParams = (
  param: string,
  encryptedParam: string,
): boolean => {
  return compareSync(param, encryptedParam);
};
