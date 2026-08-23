import {
  Controller,
  ParseUUIDPipe,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { SearchBrandsByDto } from './dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { brandMessagePatterns } from 'src/common/consts';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @MessagePattern({ cmd: brandMessagePatterns.CREATE_BRAND })
  create(@Payload() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  @MessagePattern({ cmd: brandMessagePatterns.GET_BRANDS })
  findAll(@Payload() queryParams: SearchBrandsByDto) {
    return this.brandsService.findAll(queryParams);
  }

  @MessagePattern({ cmd: brandMessagePatterns.GET_BRAND })
  findOne(@Payload('id', ParseUUIDPipe) id: string) {
    return this.brandsService.findOne(id);
  }

  @MessagePattern({ cmd: brandMessagePatterns.EDIT_BRAND })
  update(
    @Payload() updateBrandDto: UpdateBrandDto,
  ) {
    return this.brandsService.update(updateBrandDto.id, updateBrandDto);
  }

  @MessagePattern({ cmd: brandMessagePatterns.DELETE_BRAND })
  remove(@Payload('id', ParseUUIDPipe) id: string) {
    return this.brandsService.remove(id);
  }

  @MessagePattern({ cmd: brandMessagePatterns.REACTIVATE_BRAND })
  reactivate(@Payload('id', ParseUUIDPipe) id: string) {
    return this.brandsService.reactivate(id);
  }
}
