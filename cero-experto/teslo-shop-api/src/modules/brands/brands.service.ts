import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Repository } from 'typeorm';
import { errorHandleException } from 'src/exceptions/error-handle.exception';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    try {
      const brand = this.brandRepository.create(createBrandDto);
      return this.brandRepository.save(brand);
    } catch (error) {
      return errorHandleException(error);
    }
  }

  async findAll(): Promise<Brand[]> {
    try {
      const brands = await this.brandRepository.find({
        where: { isActive: true },
      });
      return brands;
    } catch (error) {
      return errorHandleException(error);
    }
  }

  async findOne(id: string): Promise<Brand> {
    try {
      const brand = await this.brandRepository.findOne({ where: { id: id } });
      if (!brand) throw new NotFoundException('Brand not found');
      return brand;
    } catch (error) {
      return errorHandleException(error);
    }
  }

  async update(id: string, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    try {
      const brand = await this.findOne(id);
      return await this.brandRepository.save({...brand, ...updateBrandDto});
    } catch (error) {
      return errorHandleException(error);
    }
  }

  async remove(id: string): Promise<Brand> {
    try {
      const brand = await this.brandRepository.preload({ id: id });
      if (!brand) throw new NotFoundException('Brand not found');
      return await this.brandRepository.save({ ...brand, isActive: false });
    } catch (error) {
      return errorHandleException(error);
    }
  }
}
