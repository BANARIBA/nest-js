import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Repository } from 'typeorm';
import { SearchBrandsByDto } from './dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    public readonly brandsRepository: Repository<Brand>,
  ) {}

  public async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    const newBrand = this.brandsRepository.create(createBrandDto);
    return this.brandsRepository.save(newBrand);
  }

  public async findAll(queryParams: SearchBrandsByDto): Promise<{
    data: Brand[];
    totalRecords: number;
  }> {
    const { limit = 10, skip = 0, name, is_active, created_at } = queryParams;
    const offset = limit * skip;

    const query = this.brandsRepository.createQueryBuilder('brand');

    if (name) {
      query.andWhere('brand.name ILIKE :name', {
        name: `%${name.trim()}%`,
      });
    }

    if (is_active !== undefined) {
      query.andWhere('brand.is_active = :isActive', {
        isActive: is_active === 'true',
      });
    }

    if (created_at) {
      query.andWhere('DATE(brand.created_at) = :createdAt', {
        createdAt: created_at.toISOString().split('T')[0],
      });
    }

    query.orderBy('brand.created_at', 'DESC').skip(offset).take(limit);

    const [data, totalRecords] = await query.getManyAndCount();

    return {
      data,
      totalRecords,
    };
  }

  public async findOne(id: string): Promise<Brand> {
    const query = this.brandsRepository.createQueryBuilder('brand');
    query.where('brand.id=:id', { id: id });
    const brand = await query.getOne();
    if (!brand) {
      throw new RpcException({ message: 'Brand not found', status: HttpStatus.NOT_FOUND});
    }
    return brand;
  }

  public async update(
    id: string,
    updateBrandDto: UpdateBrandDto,
  ): Promise<Brand> {
    const { id: _, ...restBrand } = updateBrandDto;
    const existsBrand = await this.brandsRepository.preload({
      id: id,
      ...restBrand,
      updated_at: new Date(),
    });
    if (!existsBrand) {
      throw new RpcException({ message: 'Brand not found', status: HttpStatus.NOT_FOUND});
    }
    return await this.brandsRepository.save(existsBrand);
  }

  public async remove(id: string): Promise<Brand> {
    const existsBrand = await this.brandsRepository.preload({
      id: id,
      is_active: false,
      deleted_at: new Date(),
    });
    if (!existsBrand) {
      throw new RpcException({ message: 'Brand not found', status: HttpStatus.NOT_FOUND});
    }
    return await this.brandsRepository.save(existsBrand);
  }

  public async reactivate(id: string): Promise<Brand> {
    const existsBrand = await this.brandsRepository.preload({
      id: id,
      is_active: true,
      deleted_at: null,
    });
    if (!existsBrand) {
      throw new RpcException({ message: 'Brand not found', status: HttpStatus.NOT_FOUND});
    }
    return await this.brandsRepository.save(existsBrand);
  }
}
