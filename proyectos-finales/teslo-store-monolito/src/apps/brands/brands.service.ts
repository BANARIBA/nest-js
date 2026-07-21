import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandsRepository: Repository<Brand>,
  ) {}

  public async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    const brand = this.brandsRepository.create(createBrandDto);
    return await this.brandsRepository.save(brand);
  }

  findAll() {
    return `This action returns all brands`;
  }

  findOne(id: number) {
    return `This action returns a #${id} brand`;
  }

  update(id: number, updateBrandDto: UpdateBrandDto) {
    return `This action updates a #${id} brand ${updateBrandDto.name}`;
  }

  remove(id: number) {
    return `This action removes a #${id} brand`;
  }
}
