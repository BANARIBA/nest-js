import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Repository } from 'typeorm';
import { SearchBrandsByDto } from './dto/search-brands-by.dto';
import { paginationDefaultValues } from '../../config';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandsRepository: Repository<Brand>,
  ) {}

  public async create(createBrandDto: CreateBrandDto) {
    const brand = this.brandsRepository.create(createBrandDto);
    return await this.brandsRepository.save(brand);
  }

  public async findAll(searchBrandsByDto: SearchBrandsByDto) {
    const {
      limit = paginationDefaultValues.limit,
      skip = paginationDefaultValues.skip,
      name,
      is_active,
    } = searchBrandsByDto;
    const query = this.brandsRepository.createQueryBuilder('brand');

    if (name) {
      query.andWhere('brand.name ILIKE :name', { name: `%${name}%` });
    }

    if (is_active) {
      const active = is_active === 'true';
      query.andWhere('brand.is_active = :active', { active });
    }
    query.orderBy('brand.created_at', 'DESC');
    query.skip(skip * limit);
    query.take(limit);
    const [brands, total] = await query.getManyAndCount();
    return {
      data: brands,
      total,
      limit,
      skip,
    };
  }

  public async findOne(id: string) {
    const brand = await this.brandsRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!brand) throw new NotFoundException('Brand not found');
    return brand;
  }

  public async update(updateBrandDto: UpdateBrandDto) {
    const brand = await this.brandsRepository.preload({
      id: updateBrandDto.id,
    });
    if (!brand) throw new NotFoundException('Brand not found.');
    return await this.brandsRepository.save({ ...brand, ...updateBrandDto });
  }

  public async remove(id: string) {
    const brand = await this.brandsRepository.preload({ id: id });
    if (!brand) throw new NotFoundException('Brand not found.');
    return await this.brandsRepository.save({ ...brand, is_active: false });
  }
}
