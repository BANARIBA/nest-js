import { Controller, Body, ParseUUIDPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductByDto } from './dto/search-products-by.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern({ cmd: 'create_product' })
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @MessagePattern({ cmd: 'get_all_products' })
  findAll(@Payload() searchProductByDto: SearchProductByDto) {
    return this.productsService.findAll(searchProductByDto);
  }

  @MessagePattern({ cmd: 'get_product' })
  findOne(@Payload('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @MessagePattern({ cmd: 'edit_product' })
  update(@Payload() updateProductDto: UpdateProductDto) {
    return this.productsService.update(updateProductDto);
  }

  @MessagePattern({ cmd: 'delete_product' })
  remove(@Payload('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
