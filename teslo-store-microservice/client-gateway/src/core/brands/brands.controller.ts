import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';

@Controller('brands')
export class BrandsController {
  constructor() {}

  @Post()
  public create() {
    return { data: 'Product created' };
  }

  @Get()
  public findAll() {
    return { data: 'All products' };
  }

  @Get(':id')
  public findOne() {
    return { data: 'Product found' };
  }

  @Patch(':id')
  public update() {
    return { data: 'Product updated' };
  }

  @Delete(':id')
  public remove() {
    return { data: 'Product removed' };
  }

  @Patch('reactivate/:id')
  public reactivate() {
    return { data: 'Product reactivated' };
  }
}
