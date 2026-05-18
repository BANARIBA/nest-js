import { Controller } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { SearchBrandDto } from './dto/search-brand.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { brandsMessagePatters } from 'src/common/consts';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @MessagePattern(brandsMessagePatters.CREATE)
  create(@Payload() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  @MessagePattern(brandsMessagePatters.FIND_BY)
  findAll(@Payload() searchBrandDto: SearchBrandDto) {
    return this.brandsService.findAll(searchBrandDto);
  }

  @MessagePattern(brandsMessagePatters.FIND_ONE)
  findOne(@Payload('id') id: string) {
    return this.brandsService.findOne(id);
  }

  @MessagePattern(brandsMessagePatters.UPDATE)
  update(@Payload() updateBrandDto: UpdateBrandDto) {
    return this.brandsService.update(updateBrandDto.id, updateBrandDto);
  }

  @MessagePattern(brandsMessagePatters.DELETE)
  remove(@Payload('id') id: string) {
    return this.brandsService.remove(id);
  }

  @MessagePattern(brandsMessagePatters.REACTIVATE)
  reactivate(@Payload('id') id: string) {
    return this.brandsService.reactivate(id);
  }
}
