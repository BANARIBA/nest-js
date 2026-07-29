import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBody, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { SearchProductsByDto } from './dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un producto' })
  @ApiBody({
    type: CreateProductDto,
    examples: {
      createProduct: {
        summary: 'Ejemplo para crear un producto',
        value: {
          title: 'Xioami 14T',
          sizes: ['SM', 'M', 'L'],
          gender: 'unisex',
          slug: 'xiaomi_14_t',
          brand_id: '72a35692-638f-4635-adc1-4087c1b04290',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Producto creado correctamente',
    schema: {
      example: {
        id: '13cc2e37-cc0d-44b0-9b12-38a5b08cb28c',
        title: 'Xioami 14T',
        description: null,
        price: 0,
        slug: 'xiaomi_14_t',
        stock: 0,
        sizes: ['SM', 'M', 'L'],
        gender: 'unisex',
        is_active: true,
        brand: {
          id: '72a35692-638f-4635-adc1-4087c1b04290',
          name: 'Xiaomi',
          is_active: true,
          created_at: '2026-07-21T04:15:14.026Z',
          updated_at: '2026-07-21T04:15:14.026Z',
          deleted_at: null,
        },
        created_at: '2026-07-21T04:22:48.869Z',
        updated_at: '2026-07-21T04:22:48.869Z',
        deleted_at: null,
      },
    },
  })
  public create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  public findAll(
    @Query() queryParams: SearchProductsByDto
  ) {
    return this.productsService.findAll(queryParams);
  }

  @Get(':id')
  public findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  public update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  public remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }

  @Patch(':id/reactivate')
  public reactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.reactivate(id);
  }
}
