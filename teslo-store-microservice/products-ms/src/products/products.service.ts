import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Brand } from '../brands/entities/brand.entity';
import { SearchProducts } from './dto/search-products.dto';
import { defaultPaginationValues } from '../common/consts';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Brand)
    private readonly brandsRepository: Repository<Brand>,
  ) {}

  public async create(createProductDto: CreateProductDto): Promise<Product> {
    const existsBrand: Brand | null = await this.brandsRepository.findOne({
      where: {
        id: createProductDto.brand_id,
      },
    });
    if (!existsBrand) throw new NotFoundException('Brand not found');
    const newProdut: Product = this.productsRepository.create({
      ...createProductDto,
      brand: existsBrand,
    });
    return await this.productsRepository.save(newProdut);
  }

  public async findAll(searchProducts: SearchProducts): Promise<{
    data: Product[];
    total: number;
  }> {
    const {
      limit = defaultPaginationValues.limit,
      skip = defaultPaginationValues.skip,
      name,
      min_price, // Extraemos los nuevos campos
      max_price,
      is_active,
      brand,
      init_date,
      end_date,
    } = searchProducts;
    const queryBuilder = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.images', 'images');

    if (name) {
      queryBuilder.andWhere('LOWER(product.name) LIKE :name', {
        name: `%${name.toLowerCase()}%`,
      });
    }

    if (min_price !== undefined) {
      queryBuilder.andWhere('product.price >= :min_price', { min_price });
    }

    if (max_price !== undefined) {
      queryBuilder.andWhere('product.price <= :max_price', { max_price });
    }

    if (is_active !== undefined) {
      queryBuilder.andWhere('product.is_active = :is_active', {
        is_active: is_active === 'true',
      });
    }

    if (brand) {
      queryBuilder.andWhere('brand.id = :brandId', { brandId: brand });
    }

    if (init_date && end_date) {
      queryBuilder.andWhere('product.created_at BETWEEN :start AND :end', {
        start: `${init_date}`,
        end: `${end_date}`,
      });
    } else if (init_date && !end_date) {
      queryBuilder.andWhere('product.created_at >= :start', {
        start: `${init_date}`,
      });
    } else if (end_date && !init_date) {
      queryBuilder.andWhere('product.created_at <= :end', {
        end: `${end_date}`,
      });
    }

    queryBuilder.orderBy('product.created_at', 'DESC');
    queryBuilder.take(limit);
    queryBuilder.skip(skip * limit);
    const [products, total] = await queryBuilder.getManyAndCount();
    return {
      data: products,
      total: total,
    };
  }

  public async findOne(id: string): Promise<Product> {
    const product: Product | null = await this.productsRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  public async update(id: string, updateProductDto: UpdateProductDto) {
    const product: Product | undefined = await this.productsRepository.preload({
      id: id,
    });
    if (!product) throw new NotFoundException('Product not found');
    if (updateProductDto.brand_id) {
      const existsBrand: Brand | null = await this.brandsRepository.findOne({
        where: {
          id: updateProductDto.brand_id,
        },
      });
      if (!existsBrand) throw new NotFoundException('Brand not found');
      product.brand = existsBrand;
    }
    return await this.productsRepository.save({
      ...product,
      ...updateProductDto,
    });
  }

  public async remove(id: string): Promise<Product> {
    const product: Product | undefined = await this.productsRepository.preload({
      id: id,
    });
    if (!product) throw new NotFoundException('Product not found');
    return await this.productsRepository.save({
      ...product,
      deleted_at: new Date(),
      is_active: false,
    });
  }

  public async reactivate(id: string): Promise<Product> {
    const product: Product | undefined = await this.productsRepository.preload({
      id: id,
    });
    if (!product) throw new NotFoundException('Product not found');
    return await this.productsRepository.save({
      ...product,
      deleted_at: null,
      is_active: true,
    });
  }
}
