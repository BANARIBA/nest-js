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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { microservices, productsMessagePatters } from 'src/common/consts';
import { SearchProducts } from './dtos/search-products.dto';
import { catchError } from 'rxjs';
import { ProductResponse } from './types/products-response.types';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'Multer';
import { imageFileFilter } from 'src/common/helpers/file-filter.helper';
import { mapFilesToImageDto } from 'src/common/utils/files-to-dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(microservices.PRODUCTS_MS)
    private readonly productsClient: ClientProxy,
  ) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: memoryStorage(),
      fileFilter: imageFileFilter,
    }),
  )
  public create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productsClient
      .send<ProductResponse>(productsMessagePatters.CREATE, {
        ...createProductDto,
        images: mapFilesToImageDto(files),
      })
      .pipe(
        catchError((err) => {
          throw new RpcException(err as string | object);
        }),
      );
  }

  @Get()
  public findAll(@Query() searchProducts: SearchProducts) {
    return this.productsClient.send(
      productsMessagePatters.FIND_BY,
      searchProducts,
    );
  }

  @Get(':id')
  public findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsClient
      .send<ProductResponse>(productsMessagePatters.FIND_ONE, {
        id: id,
      })
      .pipe(
        catchError((err) => {
          throw new RpcException(err as string | object);
        }),
      );
    // try {
    // const product = await firstValueFrom(
    //   this.productsClient.send<ProductResponse>(
    //     productsMessagePatters.FIND_ONE,
    //     {
    //       id: id,
    //     },
    //   ),
    // );
    // return product;
    // } catch (error) {
    //   throw new RpcException(error as object | string);
    // }
  }

  @Patch(':id')
  public update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsClient
      .send(productsMessagePatters.UPDATE, {
        ...updateProductDto,
        id: id,
      })
      .pipe(
        catchError((err) => {
          throw new RpcException(err as string | object);
        }),
      );
  }

  @Delete(':id')
  public remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsClient
      .send(productsMessagePatters.DELETE, { id: id })
      .pipe(
        catchError((err) => {
          throw new RpcException(err as string | object);
        }),
      );
  }

  @Patch('reactivate/:id')
  public reactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsClient
      .send(productsMessagePatters.REACTIVATE, { id: id })
      .pipe(
        catchError((err) => {
          throw new RpcException(err as string | object);
        }),
      );
  }
}
