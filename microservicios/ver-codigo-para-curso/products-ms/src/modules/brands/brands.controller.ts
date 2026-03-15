import { Controller } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { SearchBrandsByDto } from './dto/search-brands-by.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @MessagePattern({ cmd: 'create_brand' })
  create(@Payload() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  @MessagePattern({ cmd: 'get_all_brands' })
  findAll(@Payload() searchBrandsByDto: SearchBrandsByDto) {
    return this.brandsService.findAll(searchBrandsByDto);
  }

  @MessagePattern({ cmd: 'get_brand' })
  findOne(@Payload() data: { brand_id: string }) {
    return this.brandsService.findOne(data.brand_id);
  }

  @MessagePattern({ cmd: 'edit_brand' })
  update(@Payload() updateBrandDto: UpdateBrandDto) {
    return this.brandsService.update(updateBrandDto);
  }

  @MessagePattern({ cmd: 'delete_brand' })
  remove(@Payload() data: { brand_id: string }) {
    return this.brandsService.remove(data.brand_id);
  }
}
