import { Controller, Get, HttpException, HttpStatus, Param, Post, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileName } from './helpers';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService, private readonly configService: ConfigService) { }

  @Post("/product")
  @ApiResponse({status: 200, description: 'Image Uploaded Successfully'})
  @ApiResponse({status: 500, description: 'Sometime went wrong uplading the image'})
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    /*limits: {fieldSize: 1000},*/
    storage: diskStorage({
      destination: './static/products',
      filename: fileName,
    })
  }))
  uploadProductFile(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) throw new HttpException(`File is required`, HttpStatus.BAD_REQUEST);
      const secureUrl: string = `${this.configService.get('HOST_API')}/uploads/product/${file.filename}`;
      return { file: file, secureUrl: secureUrl };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(`Sometime went wrong: ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post("/products")
  uploadProductFiles (
    @UploadedFiles()
    files: Array<Express.Multer.File>
  ) {
    // TODO: implementar la subida de multiples imagenes
  }

  @Get("/product/:fileName")
  @ApiResponse({status: 200, description: 'Image getting Successfully'})
  @ApiResponse({status: 500, description: 'Sometime went wrong getting the image'})
  findProductFile(
    @Param('fileName') imageName: string,
    @Res() res: Response
  ) {
    const path = this.uploadsService.getStaticProductImage(imageName)
    res.sendFile(path);
  }
}
