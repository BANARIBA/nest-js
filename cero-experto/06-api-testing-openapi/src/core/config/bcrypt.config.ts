import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

export const encrypt = (param: string): string => {
  const salt = genSaltSync(10);
  return hashSync(param, salt);
}

export const isMatched = (fieldOne: string, fieldTwo: string): boolean => {
  return compareSync(fieldOne, fieldTwo);
}