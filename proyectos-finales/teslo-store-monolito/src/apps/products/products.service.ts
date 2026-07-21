import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Brand } from '../brands/entities/brand.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Brand)
    private readonly brandsRepository: Repository<Brand>,
  ) {}

  public async create(createProductDto: CreateProductDto): Promise<Product> {
    const { brand_id, ...rest } = createProductDto;
    const existsBrand = await this.brandsRepository.findOne({
      where: { id: brand_id },
    });
    if (!existsBrand) {
      throw new Error(`Brand with id ${createProductDto.brand_id} not found`);
    }
    const product = this.productsRepository.create({
      ...rest,
      brand: existsBrand,
    });
    const savedProduct = await this.productsRepository.save(product);
    return savedProduct;
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product ${updateProductDto.title}`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
