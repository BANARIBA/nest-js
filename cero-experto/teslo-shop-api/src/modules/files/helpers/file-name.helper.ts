import { BadRequestException } from '@nestjs/common';
import { setUUID } from 'src/shared/utils/uuid.utils';

export const fileName = (
  req: Express.Request,
  file: Express.Multer.File,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  callback: Function,
) => {
  if (!file) throw new BadRequestException('File is empty!');

  const fileExtension: string = file.mimetype.split('/')[1];
  const fileName = `${setUUID()}.${fileExtension}`;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  callback(null, fileName);
};
