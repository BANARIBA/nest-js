import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProducts } from './dto/search-products.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { productsMessagePatters } from 'src/common/consts';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern(productsMessagePatters.CREATE)
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @MessagePattern(productsMessagePatters.FIND_BY)
  findAll(@Payload() searchProducts: SearchProducts) {
    return this.productsService.findAll(searchProducts);
  }

  @MessagePattern(productsMessagePatters.FIND_ONE)
  findOne(@Payload('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @MessagePattern(productsMessagePatters.UPDATE)
  update(@Payload() updateProductDto: UpdateProductDto) {
    return this.productsService.update(updateProductDto.id, updateProductDto);
  }

  @MessagePattern(productsMessagePatters.DELETE)
  remove(@Payload('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }

  @MessagePattern(productsMessagePatters.REACTIVATE)
  reactivate(@Payload('id', ParseUUIDPipe) id: string) {
    return this.productsService.reactivate(id);
  }
}
