import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Repository } from 'typeorm';
import { httpHandleError } from 'src/errors';
import { FindByDto } from './dto';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand) private readonly brandsRepo: Repository<Brand>,
  ) {}

  public async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    try {
      const newBrand = this.brandsRepo.create(createBrandDto);
      return await this.brandsRepo.save(newBrand);
    } catch (error) {
      return httpHandleError(error);
    }
  }

  public async findAll(findByDto: FindByDto) {
    const {
      limit = 10,
      page = 1,
      name,
      is_active,
      init_date,
      end_date,
    } = findByDto;
    const offset = (page - 1) * limit;
    const queryBuilder = this.brandsRepo.createQueryBuilder('brand');

    if (name) {
      queryBuilder.andWhere('LOWER(brand.name) LIKE :name', {
        name: `%${name.toLowerCase()}%`,
      });
    }

    if (is_active !== undefined) {
      queryBuilder.andWhere('brand.is_active = :is_active', { is_active });
    }

    if (init_date && end_date) {
      queryBuilder.andWhere('brand.created_at BETWEEN :init AND :end', {
        init: init_date,
        end: end_date,
      });
    }

    queryBuilder.take(limit).skip(offset);
    const [brands, total] = await queryBuilder.getManyAndCount();
    return {
      total,
      page,
      lastPage: Math.ceil(total / limit),
      data: brands,
    };
  }

  public async findOne(id: string): Promise<Brand> {
    try {
      const brand = await this.brandsRepo.findOneBy({ id: id.toString() });
      if (!brand) throw new NotFoundException('Marca no encontrada');
      return brand;
    } catch (error) {
      return httpHandleError(error);
    }
  }

  public async update(
    id: string,
    updateBrandDto: UpdateBrandDto,
  ): Promise<Brand> {
    try {
      const brand = await this.brandsRepo.preload({
        id: id,
      });
      if (!brand) throw new NotFoundException('Marca no encontrada');
      return await this.brandsRepo.save({
        ...brand,
        ...updateBrandDto,
        updated_at: new Date(),
      });
    } catch (error) {
      return httpHandleError(error);
    }
  }

  public async remove(id: string): Promise<Brand> {
    try {
      const brand = await this.brandsRepo.preload({ id: id });
      if (!brand) throw new NotFoundException('Marca no encontrada');
      return await this.brandsRepo.save({
        ...brand,
        deleted_at: new Date(),
        updated_at: new Date(),
        is_active: false,
      });
    } catch (error) {
      return httpHandleError(error);
    }
  }

  public async reactivate(id: string): Promise<Brand> {
    try {
      const brand = await this.brandsRepo.preload({ id: id });
      if (!brand) throw new NotFoundException('Marca no encontrada');
      return await this.brandsRepo.save({
        ...brand,
        deleted_at: null,
        updated_at: new Date(),
        is_active: true,
      });
    } catch (error) {
      return httpHandleError(error);
    }
  }
}
