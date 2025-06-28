import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductByDto } from './dto/search-product-by-term.dto';
import { SearchProductBy } from './interfaces';
import { Auth, GetUser } from 'src/auth/decorators';
import { Roles } from 'src/auth/enums';
import { User } from 'src/users/entities/user.entity';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Product } from './entities/product.entity';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiResponse({status: 201, description: 'Product was created', type: Product})
  @ApiResponse({status: 400, description: 'Product was not created'})
  @ApiResponse({status: 401, description: 'Unauthorized or user was not authenticated'})
  @ApiResponse({status: 500, description: 'Sometime went wrong creating product'})
  @Auth(Roles.ADMIN, Roles.SUPER_USER)
  create(
    @GetUser() user: User,
    @Body() createProductDto: CreateProductDto
  ) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @ApiResponse({status: 200, description: 'Products found'})
  @ApiResponse({status: 404, description: 'Products not found'})
  @ApiResponse({status: 500, description: 'Sometime went wrong getting the products'})
  findAll(
    @Query() searchProductByDto: SearchProductByDto,
  ) {
    const {title, description, slug} = searchProductByDto;
    let searchProductBy: SearchProductBy = {};

    if (title) {
      searchProductBy.title = title;
    }

    if (description) {
      searchProductBy.description = description;
    }

    if (slug) {
      searchProductBy.slug = slug;
    }
    return this.productsService.findAll(searchProductByDto.limit, searchProductByDto.offset, searchProductBy);
  }

  @Get(':term')
  @ApiResponse({status: 200, description: 'Product founded',  type: Product})
  @ApiResponse({status: 404, description: 'Products not found'})
  @ApiResponse({status: 500, description: 'Sometime went wrong getting the products'})
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlane(term);
  }

  @Patch(':product_id')
  @ApiResponse({status: 200, description: 'Product updated successfully',  type: Product})
  @ApiResponse({status: 404, description: 'Product not found'})
  @ApiResponse({status: 400, description: 'Product was not updated or duplicated'})
  @ApiResponse({status: 500, description: 'Sometime went wrong updating product'})
  @Auth(Roles.ADMIN, Roles.SUPER_USER)
  update(
    @GetUser() user: User,
    @Param('product_id', ParseUUIDPipe) product_id: string, 
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.update(product_id, updateProductDto, user);
  }

  @Delete(':product_id')
  @ApiResponse({status: 200, description: 'Product updated successfully',  type: Product})
  @ApiResponse({status: 404, description: 'Product not found'})
  @ApiResponse({status: 500, description: 'Sometime went wrong deleting product'})
  @Auth(Roles.ADMIN, Roles.SUPER_USER)
  remove(@Param('product_id', ParseUUIDPipe) product_id: string) {
    return this.productsService.remove(product_id);
  }
}
