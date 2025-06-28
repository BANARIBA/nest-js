import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';
import { UUIDConfig } from 'src/config';

@Injectable()
export class BrandsService {

  private brands: Brand[] = [];

  create(createBrandDto: CreateBrandDto) {
    const newBrand: Brand = {id: UUIDConfig.uuid, name: createBrandDto.name, createdAt: new Date(), updatedAt: null};
    this.brands = [newBrand, ...this.brands];
    return newBrand;
  }

  findAll() {
    return this.brands;
  }

  findOne(brandId: string) {
    const brand = this.brands.find(brand => brand.id = brandId);
    if (!brand) throw new NotFoundException(`Brand with id ${brandId} not found`);
    return brand;
  }

  update(brandId: string, updateBrandDto: UpdateBrandDto) {
    const brandDB: Brand = this.findOne(brandId);
    this.brands = this.brands.map(brand => {
      if (brand.id === brandDB.id) {
        brandDB.name = updateBrandDto.name;
        brandDB.updatedAt = new Date();
        return brandDB;
      }
      return brand;
    });
    return brandDB;
  }

  remove(brandId: string) {
    let brandFounded: Brand = this.findOne(brandId);
    this.brands = this.brands.filter(brand => brand.id !== brandId);
    return brandFounded;
  }

  public fillBrandsWithSeedData (brands: Brand[]) {
    this.brands = brands;
  }
}
