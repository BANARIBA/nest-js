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
import { CreateBrandDto, SearchBrandsByDto, UpdateBrandDto } from './dto';
import { PRODUCT_API_SERVICE } from '../../consts';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { brandMessagePatterns } from 'src/common/consts';
import { catchError, firstValueFrom, throwError } from 'rxjs';

@Controller('brands')
export class BrandsController {
  constructor(
    @Inject(PRODUCT_API_SERVICE)
    private readonly productsAPIServiceClient: ClientProxy,
  ) {}

  @Post()
  public create(@Body() createBrandDto: CreateBrandDto) {
    return this.productsAPIServiceClient
      .send({ cmd: brandMessagePatterns.CREATE_BRAND }, createBrandDto)
      .pipe(
        catchError((err) => {
          throw new RpcException(err as object);
        }),
      );
  }

  @Get()
  public getAll(@Query() queryParams: SearchBrandsByDto) {
    return this.productsAPIServiceClient
      .send({ cmd: brandMessagePatterns.GET_BRANDS }, queryParams)
      .pipe(
        catchError((err) => {
          throw new RpcException(err as object);
        }),
      );
  }

  @Get(':id')
  public getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsAPIServiceClient
      .send({ cmd: brandMessagePatterns.GET_BRAND }, { id: id })
      .pipe(
        catchError((err) => {
          throw new RpcException(err as object);
        }),
      );
  }

  @Patch(':id')
  public update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ) {
    return this.productsAPIServiceClient
      .send(
        { cmd: brandMessagePatterns.EDIT_BRAND },
        { ...updateBrandDto, id: id },
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
      .send({ cmd: brandMessagePatterns.DELETE_BRAND }, { id: id })
      .pipe(
        catchError((err) => {
          throw new RpcException(err as object);
        }),
      );
  }

  @Patch(':id/reactivate')
  public reactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsAPIServiceClient
      .send({ cmd: brandMessagePatterns.REACTIVATE_BRAND }, { id: id })
      .pipe(
        catchError((err) => {
          throw new RpcException(err as object);
        }),
      );
  }
}
