import { Controller, ParseUUIDPipe } from '@nestjs/common';

import { MessagePattern, Payload } from '@nestjs/microservices';

import { productsMessagePatterns } from 'src/common/consts';

import { CreateProductImageDto } from './dto/create-product-image.dto';
import { ProductImagesService } from './product-images.service';

@Controller('product-images')
export class ProductImagesController {
  constructor(private readonly productImagesService: ProductImagesService) {}

  @MessagePattern({
    cmd: productsMessagePatterns.CREATE_PRODUCT_IMAGE,
  })
  public create(
    @Payload()
    createProductImageDto: CreateProductImageDto,
  ) {
    return this.productImagesService.create(createProductImageDto);
  }

  @MessagePattern({
    cmd: productsMessagePatterns.GET_PRODUCT_IMAGES,
  })
  public findAll(
    @Payload('productId', ParseUUIDPipe)
    productId: string,
  ) {
    return this.productImagesService.findAll(productId);
  }

  @MessagePattern({
    cmd: productsMessagePatterns.GET_PRODUCT_IMAGE,
  })
  public findOne(
    @Payload('productId', ParseUUIDPipe)
    productId: string,

    @Payload('imageId', ParseUUIDPipe)
    imageId: string,
  ) {
    return this.productImagesService.findOne(productId, imageId);
  }

  @MessagePattern({
    cmd: productsMessagePatterns.DELETE_PRODUCT_IMAGE,
  })
  public remove(
    @Payload('productId', ParseUUIDPipe)
    productId: string,

    @Payload('imageId', ParseUUIDPipe)
    imageId: string,
  ) {
    return this.productImagesService.remove(productId, imageId);
  }
}
