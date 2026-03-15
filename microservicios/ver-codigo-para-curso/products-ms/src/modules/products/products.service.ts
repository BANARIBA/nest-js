import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Brand } from '../brands/entities/brand.entity';
import { SearchProductByDto } from './dto/search-products-by.dto';
import { paginationDefaultValues } from '../../config';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Brand)
    private readonly brandsRepository: Repository<Brand>,
  ) {}

  public async create(createProductDto: CreateProductDto) {
    const existsBrand = await this.brandsRepository.findOne({
      where: {
        id: createProductDto.brand,
      },
    });
    if (!existsBrand)
      throw new NotFoundException({
        message: 'Marca no encontrada',
        status: HttpStatus.NOT_FOUND,
      });
    const product = this.productsRepository.create({
      ...createProductDto,
      brand: existsBrand,
    });
    return await this.productsRepository.save(product);
  }

  public async findAll(searchProductByDto: SearchProductByDto) {
    const {
      limit = paginationDefaultValues.limit,
      skip = paginationDefaultValues.skip,
      name,
      is_active,
      brand,
    } = searchProductByDto;
    const query = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.brand', 'brand');

    if (name) {
      query.andWhere('product.name ILIKE :name', { name: `%${name}%` });
    }

    if (is_active) {
      const active = is_active === 'true';
      query.andWhere('product.is_active = :active', { active });
    }

    if (brand) {
      query.andWhere('product.brand_id = :brandId', {
        brandId: searchProductByDto.brand,
      });
    }
    query.orderBy('product.created_at', 'DESC');
    query.skip(skip * limit);
    query.take(limit);
    const [products, total] = await query.getManyAndCount();
    return {
      data: products,
      total,
      limit,
      skip,
    };
  }

  public async findOne(id: string) {
    const product = await this.productsRepository.findOne({
      where: {
        id: id,
        is_active: true,
      },
      relations: {
        brand: true,
      },
    });
    if (!product)
      throw new RpcException({
        message: 'Producto no encontrado',
        status: HttpStatus.NOT_FOUND,
      });
    return product;
  }

  public async update(updateProductDto: UpdateProductDto) {
    const product = await this.productsRepository.preload({
      id: updateProductDto.id,
    });
    if (!product)
      throw new RpcException({
        message: 'Producto no encontrado',
        status: HttpStatus.NOT_FOUND,
      });
    const existsBrand = await this.brandsRepository.findOne({
      where: {
        id: updateProductDto.brand,
      },
    });
    if (!existsBrand)
      throw new NotFoundException({
        message: 'Marca no encontrada',
        status: HttpStatus.NOT_FOUND,
      });
    return await this.productsRepository.save({
      ...product,
      ...updateProductDto,
      brand: existsBrand,
    });
  }

  public async remove(id: string) {
    const product = await this.productsRepository.preload({ id: id });
    if (!product)
      throw new RpcException({
        message: 'Producto no encontrado',
        status: HttpStatus.NOT_FOUND,
      });
    return await this.productsRepository.save({ ...product, is_active: false });
  }
}
