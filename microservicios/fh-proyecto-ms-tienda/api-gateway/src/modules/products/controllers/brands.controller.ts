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
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PRODUCT_SERVICE } from '../../../consts';
import { CreateBrandDto } from '../dto/brands/create-brand.dto';
import { catchError } from 'rxjs';
import { SearchBrandsByDto } from '../dto/brands/search-brands-by.dto';
import { UpdateBrandDto } from '../dto/brands/update-brand.dto';

@Controller('brands')
export class BrandsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

  @Post()
  public createBrand(@Body() createBrandDto: CreateBrandDto) {
    return this.productsClient
      .send({ cmd: 'create_brand' }, createBrandDto)
      .pipe(
        catchError((err) => {
          throw new RpcException(err as unknown as string | object);
        }),
      );
  }

  @Get()
  public getBrands(@Query() searchBrandsByDto: SearchBrandsByDto) {
    return this.productsClient
      .send({ cmd: 'get_all_brands' }, searchBrandsByDto)
      .pipe(
        catchError((err) => {
          throw new RpcException(err as unknown as string | object);
        }),
      );
  }

  @Get(':brand_id')
  public getBrand(@Param('brand_id', ParseUUIDPipe) brand_id: string) {
    return this.productsClient.send({ cmd: 'get_brand' }, { brand_id }).pipe(
      catchError((err) => {
        throw new RpcException(err as unknown as string | object);
      }),
    );
  }

  @Patch(':brand_id')
  public editBrand(
    @Param('brand_id', ParseUUIDPipe) brand_id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ) {
    return this.productsClient
      .send({ cmd: 'edit_brand' }, { ...updateBrandDto, id: brand_id })
      .pipe(
        catchError((err) => {
          throw new RpcException(err as unknown as string | object);
        }),
      );
  }

  @Delete(':brand_id')
  public deleteProduct(@Param('brand_id', ParseUUIDPipe) brand_id: string) {
    return this.productsClient.send({ cmd: 'delete_brand' }, { brand_id }).pipe(
      catchError((err) => {
        throw new RpcException(err as unknown as string | object);
      }),
    );
  }
}
