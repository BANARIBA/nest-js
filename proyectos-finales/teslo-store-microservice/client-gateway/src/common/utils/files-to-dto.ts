import { ImageFileDto } from '../dtos/image-file.dto';
export const mapFilesToImageDto = (
  files: Express.Multer.File[],
): ImageFileDto[] => {
  return (files ?? []).map((file) => ({
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    buffer: file.buffer.toString('base64'),
    extension: file.originalname.split('.').pop()?.toLowerCase() ?? 'jpg',
  }));
};
