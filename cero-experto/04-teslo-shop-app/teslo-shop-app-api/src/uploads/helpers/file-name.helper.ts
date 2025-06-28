import { HttpException, HttpStatus } from "@nestjs/common";
import { getUUID } from "src/config";

export const fileName = (req: Express.Request, file: Express.Multer.File, callback: Function) => {
  if (!file) return callback(new HttpException(`The file is required.`, HttpStatus.BAD_REQUEST), false);
  const fileExtention: string = file.mimetype.split('/').pop();
  const fileName: string = `${getUUID()}.${fileExtention}`;

  return callback(null, fileName);
}