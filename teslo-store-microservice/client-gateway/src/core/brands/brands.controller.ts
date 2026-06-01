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
import { brandsMessagePatters, microservices } from 'src/common/consts';
import { CreateBrandDto } from './dto/create-brand.dto';
import { catchError } from 'rxjs';
import { SearchBrandDto } from './dto/search-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Controller('brands')
export class BrandsController {
  constructor(
    @Inject(microservices.BRANDS_MS)
    private readonly brandsClient: ClientProxy,
  ) {}

  @Post()
  public create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsClient
      .send(brandsMessagePatters.CREATE, createBrandDto)
      .pipe(
        catchError((err) => {
          throw new RpcException(err as string | object);
        }),
      );
  }

  @Get()
  public findAll(@Query() searchBrandDto: SearchBrandDto) {
    return this.brandsClient.send(brandsMessagePatters.FIND_BY, searchBrandDto);
  }

  @Get(':id')
  public findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.brandsClient
      .send(brandsMessagePatters.FIND_ONE, { id: id })
      .pipe(
        catchError((err) => {
          throw new RpcException(err as string | object);
        }),
      );
  }

  @Patch(':id')
  public update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ) {
    return this.brandsClient
      .send(brandsMessagePatters.UPDATE, { ...updateBrandDto, id: id })
      .pipe(
        catchError((err) => {
          throw new RpcException(err as string | object);
        }),
      );
  }

  @Delete(':id')
  public remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.brandsClient.send(brandsMessagePatters.DELETE, { id: id }).pipe(
      catchError((err) => {
        throw new RpcException(err as string | object);
      }),
    );
  }

  @Patch('reactivate/:id')
  public reactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.brandsClient
      .send(brandsMessagePatters.REACTIVATE, { id: id })
      .pipe(
        catchError((err) => {
          throw new RpcException(err as string | object);
        }),
      );
  }
}
