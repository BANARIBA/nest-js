import { BadRequestException } from '@nestjs/common';

export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  callback: Function,
) => {
  if (!file) throw new BadRequestException('File is empty!');

  const validExtensions = ['jpeg', 'png', 'jpg', 'webp', 'gif'];
   
  const fileExtension: string = file.mimetype.split('/')[1];
  if (validExtensions.includes(fileExtension)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return callback(null, true);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  callback(null, false);
};
