import {
  Controller,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductsByDto } from './dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { productsMessagePatterns } from 'src/common/consts';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern({ cmd: productsMessagePatterns.CREATE_PRODUCT })
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @MessagePattern({ cmd: productsMessagePatterns.GET_PRODUCTS })
  findAll(@Payload() searchBy: SearchProductsByDto) {
    return this.productsService.findAll(searchBy);
  }

  @MessagePattern({ cmd: productsMessagePatterns.GET_PRODUCT })
  findOne(@Payload('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @MessagePattern({ cmd: productsMessagePatterns.EDIT_PRODUCT })
  update(
    @Payload() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(updateProductDto.id, updateProductDto);
  }

  @MessagePattern({ cmd: productsMessagePatterns.DELETE_PRODUCT })
  remove(@Payload('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }

  @MessagePattern({ cmd: productsMessagePatterns.REACTIVATE_PRODUCT })
  reactivate(@Payload('id', ParseUUIDPipe) id: string) {
    return this.productsService.reactivate(id);
  }
}
