import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  ParseUUIDPipe,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import type { Response } from 'express';
import { memoryStorage } from 'multer';

import { ProductImagesService } from './product-images.service';

import { UploadProductImageDto } from './dto/upload-product-image.dto';
import { PRODUCT_IMAGE_MAX_SIZE_BYTES } from '../../consts';

@Controller('products')
export class ProductImagesController {
  constructor(
    private readonly productImagesService: ProductImagesService,
  ) {}

  @Post(':productId/images')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        files: 1,
        fileSize: PRODUCT_IMAGE_MAX_SIZE_BYTES,
      },
    }),
  )
  public create(
    @Param('productId', ParseUUIDPipe)
    productId: string,

    @Body()
    uploadProductImageDto: UploadProductImageDto,

    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /^image\/(jpeg|png|webp)$/,
        })
        .addMaxSizeValidator({
          maxSize: PRODUCT_IMAGE_MAX_SIZE_BYTES,
        })
        .build({
          fileIsRequired: true,
          errorHttpStatusCode:
            HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return this.productImagesService.create(
      productId,
      file,
      uploadProductImageDto.altText,
    );
  }

  @Get(':productId/images')
  public findAll(
    @Param('productId', ParseUUIDPipe)
    productId: string,
  ) {
    return this.productImagesService.findAll(productId);
  }

  @Get(':productId/images/:imageId')
  public async findOne(
    @Param('productId', ParseUUIDPipe)
    productId: string,

    @Param('imageId', ParseUUIDPipe)
    imageId: string,

    @Res({
      passthrough: true,
    })
    response: Response,
  ): Promise<StreamableFile> {
    const image =
      await this.productImagesService.findOne(
        productId,
        imageId,
      );

    const fileBuffer = Buffer.from(
      image.dataBase64,
      'base64',
    );

    response.setHeader(
      'Content-Type',
      image.mimeType,
    );

    response.setHeader(
      'Content-Length',
      fileBuffer.length.toString(),
    );

    response.setHeader(
      'Cache-Control',
      'private, max-age=3600',
    );

    return new StreamableFile(fileBuffer);
  }

  @Delete(':productId/images/:imageId')
  public remove(
    @Param('productId', ParseUUIDPipe)
    productId: string,

    @Param('imageId', ParseUUIDPipe)
    imageId: string,
  ) {
    return this.productImagesService.remove(
      productId,
      imageId,
    );
  }
}