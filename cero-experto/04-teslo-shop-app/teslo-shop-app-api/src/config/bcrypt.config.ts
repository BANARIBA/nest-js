import * as bcrypt from "bcryptjs"

export const encrypt = (paramToEncripted: string): string => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(paramToEncripted, salt);
}

export const isMatch = (param: string, encryptedParam: string): boolean => {
  return bcrypt.compareSync(param, encryptedParam);
}