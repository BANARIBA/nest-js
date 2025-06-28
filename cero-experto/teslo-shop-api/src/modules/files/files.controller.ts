import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { fileFilter } from './helpers/file-filter.helper';
import { diskStorage } from 'multer';
import { fileName } from './helpers/file-name.helper';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Post('products/upload-file')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
      storage: diskStorage({
        destination: './static/products',
        filename: fileName,
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File Image is required!');
    const secureUrl =
      this.configService.get('HOST_API') + '/files/products/' + file.filename;
    return {
      secureUrl: secureUrl,
    };
  }

  @Get('products/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string,
  ) {
    return res.sendFile(this.filesService.getStaticProductImage(imageName));
  }

  @Post('product/upload-files')
  @UseInterceptors(
    FilesInterceptor('files', undefined, {
      fileFilter: fileFilter,

      storage: diskStorage({
        destination: './static/products',
        filename: fileName,
      }),
    }),
  )
  uploadProductImages(
    @UploadedFiles()
    files: Array<Express.Multer.File>,
  ) {
    if (!files.length) {
      throw new BadRequestException('File is required, only accepted images');
    }

    const secureUrls = files.map(
      (files) =>
        `${this.configService.get('HOST_API')}/files/product/${files.filename}`,
    );

    return {
      secureUrls,
    };
  }
}
