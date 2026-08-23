import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductsByDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from '../brands/entities/brand.entity';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Brand)
    public readonly brandsRepository: Repository<Brand>,
    @InjectRepository(Product)
    public readonly productsRepository: Repository<Product>,
  ) {}

  public async create(createProductDto: CreateProductDto): Promise<Product> {
    const { brand, ...restOfProduct } = createProductDto;
    const existsBrand: Brand | null = await this.brandsRepository.findOne({
      where: {
        id: brand,
      },
    });
    if (!existsBrand) {
      throw new RpcException({
        message: 'Brand Not Found',
        status: HttpStatus.NOT_FOUND,
      });
    }
    const newProduct = this.productsRepository.create({
      brand: existsBrand,
      ...restOfProduct,
    });
    return await this.productsRepository.save(newProduct);
  }

  public async findAll(searchBy: SearchProductsByDto): Promise<{
    data: Product[];
    totalRecords: number;
  }> {
    const {
      limit = 10,
      skip = 0,
      name,
      brand_id,
      min_price,
      max_price,
      is_active,
      created_at,
    } = searchBy;

    const offset = limit * skip;

    const query = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.brand', 'brand');

    if (name) {
      query.andWhere('product.name ILIKE :name', {
        name: `%${name.trim()}%`,
      });
    }

    if (brand_id) {
      query.andWhere('brand.id = :brandId', {
        brandId: brand_id,
      });
    }

    if (min_price !== undefined) {
      query.andWhere('product.price >= :minPrice', {
        minPrice: min_price,
      });
    }

    if (max_price !== undefined) {
      query.andWhere('product.price <= :maxPrice', {
        maxPrice: max_price,
      });
    }

    if (is_active !== undefined) {
      query.andWhere('product.is_active = :isActive', {
        isActive: is_active,
      });
    }

    if (created_at) {
      query.andWhere('DATE(product.created_at) = :createdAt', {
        createdAt: created_at.toISOString().split('T')[0],
      });
    }

    query.orderBy('product.created_at', 'DESC').skip(offset).take(limit);

    const [data, totalRecords] = await query.getManyAndCount();

    return {
      data,
      totalRecords,
    };
  }

  public async findOne(id: string): Promise<Product> {
    const query = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.brand', 'brand');
    query.where('product.id = :id', { id: id });
    const product = await query.getOne();
    if (!product) {
      throw new RpcException({
        message: 'Product Not Found',
        status: HttpStatus.NOT_FOUND,
      });
    }
    return product;
  }

  public async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const { id: _, brand, ...restOfProduct } = updateProductDto;

    const existsProduct = await this.productsRepository.preload({
      id,
      ...restOfProduct,
    });

    if (!existsProduct) {
      throw new RpcException({
        message: 'Product not found.',
        status: HttpStatus.NOT_FOUND,
      });
    }

    if (brand !== undefined) {
      const existBrand = await this.brandsRepository.findOne({
        where: { id: brand },
      });

      if (!existBrand) {
        throw new RpcException({
          message: 'Brand not found.',
          status: HttpStatus.NOT_FOUND,
        });
      }

      existsProduct.brand = existBrand;
    }

    return await this.productsRepository.save(existsProduct);
  }

  public async remove(id: string): Promise<Product> {
    const existsProduct = await this.productsRepository.preload({
      id: id,
      is_active: false,
      deleted_at: new Date(),
    });
    if (!existsProduct) {
      throw new RpcException({
        message: 'Product Not Found',
        status: HttpStatus.NOT_FOUND,
      });
    }
    return await this.productsRepository.save(existsProduct);
  }

  public async reactivate(id: string): Promise<Product> {
    const existsProduct = await this.productsRepository.preload({
      id: id,
      is_active: true,
      deleted_at: null,
    });
    if (!existsProduct) {
      throw new RpcException({
        message: 'Product Not Found',
        status: HttpStatus.NOT_FOUND,
      });
    }
    return await this.productsRepository.save(existsProduct);
  }
}
