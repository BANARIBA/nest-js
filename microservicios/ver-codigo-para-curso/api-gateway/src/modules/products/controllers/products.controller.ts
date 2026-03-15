import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PRODUCT_SERVICE } from '../../../consts';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { SearchProductByDto } from '../dto/products/search-products-by.dto';
import { catchError } from 'rxjs';
import { CreateProductDto } from '../dto/products/create-product.dto';
import { UpdateProductDto } from '../dto/products/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

  @Post()
  public createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsClient
      .send({ cmd: 'create_product' }, createProductDto)
      .pipe(
        catchError((err) => {
          throw new RpcException(err as unknown as string | object);
        }),
      );
  }

  @Get()
  public getProducts(@Query() searchProductByDto: SearchProductByDto) {
    return this.productsClient
      .send({ cmd: 'get_all_products' }, searchProductByDto)
      .pipe(
        catchError((err) => {
          throw new RpcException(err as unknown as string | object);
        }),
      );
  }

  @Get(':product_id')
  public getProduct(@Param('product_id', ParseUUIDPipe) product_id: string) {
    // try {
    //   const product = await firstValueFrom<FindProductResponse>(
    //     this.productsClient.send({ cmd: 'get_product' }, { product_id }),
    //   );
    //   return product;
    // } catch (error) {
    //   throw new RpcException(error as unknown as string | object);
    // }
    return this.productsClient
      .send({ cmd: 'get_product' }, { product_id })
      .pipe(
        catchError((err) => {
          throw new RpcException(err as unknown as string | object);
        }),
      );
  }

  @Patch(':product_id')
  public editProduct(
    @Param('product_id', ParseUUIDPipe) product_id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsClient
      .send({ cmd: 'edit_product' }, { ...updateProductDto, id: product_id })
      .pipe(
        catchError((err) => {
          throw new RpcException(err as unknown as string | object);
        }),
      );
  }

  @Delete(':product_id')
  public deleteProduct(@Param('product_id', ParseUUIDPipe) product_id: string) {
    return this.productsClient
      .send({ cmd: 'delete_product' }, { product_id })
      .pipe(
        catchError((err) => {
          throw new RpcException(err as unknown as string | object);
        }),
      );
  }
}
