import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { SearchBrandDto } from './dto/search-brand.dto';
import { defaultPaginationValues } from '../common/consts';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandsRepository: Repository<Brand>,
  ) {}

  public async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    const newBrand: Brand = this.brandsRepository.create(createBrandDto);
    return await this.brandsRepository.save(newBrand);
  }

  public async findAll(searchBrandDto: SearchBrandDto): Promise<{
    data: Brand[];
    total: number;
  }> {
    const {
      limit = defaultPaginationValues.limit,
      skip = defaultPaginationValues.skip,
      name,
      description,
      is_active,
      init_date,
      end_date,
    } = searchBrandDto;

    const queryBuilder = this.brandsRepository.createQueryBuilder('brand');

    // Filtro por Nombre (Case Insensitive)
    if (name?.trim()) {
      queryBuilder.andWhere('LOWER(brand.name) LIKE :name', {
        name: `%${name.toLowerCase()}%`,
      });
    }

    // Filtro por Descripción (Case Insensitive)
    if (description?.trim()) {
      queryBuilder.andWhere('LOWER(brand.description) LIKE :description', {
        description: `%${description.toLowerCase()}%`,
      });
    }

    // Filtro por Estado (Manejo de strings o boleanos)
    if (is_active !== undefined) {
      queryBuilder.andWhere('brand.is_active = :is_active', {
        is_active: String(is_active) === 'true',
      });
    }

    // Filtro por Rango de Fechas (Simplificado)
    console.log({ init_date, end_date });
    if (init_date) {
      queryBuilder.andWhere('brand.created_at >= :init_date', { init_date });
    }

    if (end_date) {
      queryBuilder.andWhere('brand.created_at <= :end_date', { end_date });
    }

    // Orden, Paginación y Ejecución
    queryBuilder
      .orderBy('brand.created_at', 'DESC')
      .take(limit)
      .skip(skip * limit);

    const [brands, total] = await queryBuilder.getManyAndCount();

    return {
      data: brands,
      total,
    };
  }
  public async findOne(id: string): Promise<Brand> {
    const existsBrand = await this.brandsRepository.findOne({
      where: { id: id },
    });
    if (!existsBrand)
      throw new NotFoundException(`Brand with id ${id} not found`);
    return existsBrand;
  }

  public async update(id: string, updateBrandDto: UpdateBrandDto) {
    const existsBrand = await this.brandsRepository.preload({
      id: id,
    });
    if (!existsBrand)
      throw new NotFoundException(`Brand with id ${id} not found`);
    return this.brandsRepository.save({
      ...existsBrand,
      ...updateBrandDto,
    });
  }

  public async remove(id: string) {
    const existsBrand = await this.brandsRepository.preload({
      id: id,
    });
    if (!existsBrand)
      throw new NotFoundException(`Brand with id ${id} not found`);
    return this.brandsRepository.save({
      ...existsBrand,
      deleted_at: new Date(),
      is_active: false,
    });
  }

  public async reactivate(id: string) {
    const existsBrand = await this.brandsRepository.preload({
      id: id,
    });
    if (!existsBrand)
      throw new NotFoundException(`Brand with id ${id} not found`);
    return this.brandsRepository.save({
      ...existsBrand,
      deleted_at: null,
      is_active: true,
    });
  }
}
