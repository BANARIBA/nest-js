import { HttpException, HttpStatus } from "@nestjs/common";

export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {
  // console.log(file);

  if (!file) return callback(new HttpException(`The file is required.`, HttpStatus.BAD_REQUEST), false);

  const fileExtention = file.mimetype.split('/').pop();
  const validExtentions: string[] = ["png", "jpge", "gif", "jpg"];

  if (!validExtentions.includes(fileExtention)) return callback(new HttpException(`Valid images extentions: ${validExtentions.join(',')}`, HttpStatus.BAD_REQUEST), false);

  return callback(null, true);
}