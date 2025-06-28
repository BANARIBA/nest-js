import mongoose from "mongoose"

export const verifyObjectiD = (uuid: string): boolean => {
  return mongoose.isValidObjectId(uuid);
}