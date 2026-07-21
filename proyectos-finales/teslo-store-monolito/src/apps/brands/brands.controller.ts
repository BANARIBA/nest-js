import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ApiBody, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una marca' })
  @ApiBody({
    type: CreateBrandDto,
    examples: {
      createBrand: {
        summary: 'Ejemplo de creación de marca',
        value: {
          name: 'Xiaomi',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Marca creada correctamente',
    schema: {
      example: {
        id: '72a35692-638f-4635-adc1-4087c1b04290',
        name: 'Xiaomi',
        is_active: true,
        created_at: '2026-07-21T04:15:14.026Z',
        updated_at: '2026-07-21T04:15:14.026Z',
        deleted_at: null,
      },
    },
  })
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  @Get()
  findAll() {
    return this.brandsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandsService.update(+id, updateBrandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandsService.remove(+id);
  }
}
