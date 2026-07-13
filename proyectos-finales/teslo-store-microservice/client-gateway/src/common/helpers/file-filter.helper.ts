import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
  'image/svg+xml',
] as const;

export const ALLOWED_EXTENSIONS = ['jpeg', 'jpg', 'gif', 'webp', 'svg'];

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

export const imageFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
): void => {
  const extension = file.originalname.split('.').pop()?.toLowerCase() ?? '';
  const isValidMime = (ALLOWED_MIME_TYPES as readonly string[]).includes(
    file.mimetype,
  );
  const isValidExtension = ALLOWED_EXTENSIONS.includes(extension);

  if (!isValidMime || !isValidExtension) {
    return callback(
      new BadRequestException(
        `Tipo de archivo no permitido: "${file.originalname}". Solo se permiten: ${ALLOWED_EXTENSIONS.join(', ')}`,
      ),
      false,
    );
  }

  callback(null, true);
};
