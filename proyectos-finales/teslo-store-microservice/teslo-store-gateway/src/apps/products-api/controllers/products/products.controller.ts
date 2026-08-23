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
import { PRODUCT_API_SERVICE } from '../../consts';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { productsMessagePatterns } from 'src/common/consts';
import { CreateProductDto, SearchProductsByDto, UpdateProductDto } from './dto';
import { catchError } from 'rxjs';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_API_SERVICE)
    private readonly productsAPIServiceClient: ClientProxy,
  ) {}

  @Post()
  public create(@Body() createProductDto: CreateProductDto) {
    return this.productsAPIServiceClient
      .send({ cmd: productsMessagePatterns.CREATE_PRODUCT }, createProductDto)
      .pipe(
        catchError((err) => {
          throw new RpcException(err as object);
        }),
      );
  }

  @Get()
  public getAll(@Query() queryParams: SearchProductsByDto) {
    return this.productsAPIServiceClient
      .send({ cmd: productsMessagePatterns.GET_PRODUCTS }, queryParams)
      .pipe(
        catchError((err) => {
          throw new RpcException(err as object);
        }),
      );
  }

  @Get(':id')
  public getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsAPIServiceClient
      .send({ cmd: productsMessagePatterns.GET_PRODUCT }, { id })
      .pipe(
        catchError((err) => {
          throw new RpcException(err as object);
        }),
      );
  }

  @Patch(':id')
  public update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsAPIServiceClient
      .send(
        { cmd: productsMessagePatterns.EDIT_PRODUCT },
        { ...updateProductDto, id: id },
      )
      .pipe(
        catchError((err) => {
          throw new RpcException(err as object);
        }),
      );
  }

  @Delete(':id')
  public delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsAPIServiceClient
      .send({ cmd: productsMessagePatterns.DELETE_PRODUCT }, { id: id })
      .pipe(
        catchError((err) => {
          throw new RpcException(err as object);
        }),
      );
  }

  @Patch(':id/reactivate')
  public reactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsAPIServiceClient
      .send({ cmd: productsMessagePatterns.REACTIVATE_PRODUCT }, { id: id })
      .pipe(
        catchError((err) => {
          throw new RpcException(err as object);
        }),
      );
  }
}
