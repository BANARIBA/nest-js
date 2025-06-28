import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserRoles } from '../users/enums/roles.enum';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth(UserRoles.ADMIN)
  create(
    @GetUser('id') userId: string,
    @Body() createProductDto: CreateProductDto
  ) {
    return this.productsService.create(createProductDto, userId);
  }

  @Get()
  findAll(@Query() searcProductDto: SearchProductDto) {
    return this.productsService.findAll(searcProductDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @Auth(UserRoles.ADMIN)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Auth(UserRoles.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
