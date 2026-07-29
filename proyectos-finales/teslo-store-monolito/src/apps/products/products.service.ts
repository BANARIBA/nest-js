import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Brand } from '../brands/entities/brand.entity';
import { httpErrorHandler } from 'src/core/handlers';
import { SearchProductsByDto } from './dto';
import { PaginatedResponse } from 'src/core/types';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Brand)
    private readonly brandsRepository: Repository<Brand>,
  ) {}

  public async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const { brand_id, ...rest } = createProductDto;
      const existsBrand = await this.brandsRepository.findOne({
        where: { id: brand_id },
      });
      if (!existsBrand) {
        throw new HttpException(`La marca no existe.`, HttpStatus.NOT_FOUND);
      }
      const product = this.productsRepository.create({
        ...rest,
        brand: existsBrand,
      });
      const savedProduct = await this.productsRepository.save(product);
      return savedProduct;
    } catch (error) {
      throw httpErrorHandler(error);
    }
  }

  public async findAll(
    filters: SearchProductsByDto,
  ): Promise<PaginatedResponse<Product>> {
    try {
      const {
        title,
        description,
        brand_id,
        min_price,
        max_price,
        is_active,
        init_created_at,
        end_created_at,
        limit = 5,
        skip = 1,
      } = filters;
      const offset = (skip - 1) * limit;
      const qb = this.productsRepository.createQueryBuilder('products');
      qb.innerJoin('products.brand', 'brands');
      qb.select([
        'products.id',
        'products.title',
        'products.description',
        'products.price',
        'products.slug',
        'products.stock',
        'products.sizes',
        'products.gender',
        'products.is_active',
        'products.created_at',
        'products.updated_at',
        'products.deleted_at',
        'brands.id',
        'brands.name',
      ]);
      if (title?.trim()) {
        qb.andWhere('products.title ILIKE :title', {
          title: `%${title.trim()}%`,
        });
      }

      if (description?.trim()) {
        qb.andWhere('products.description ILIKE :description', {
          description: `%${description.trim()}%`,
        });
      }

      if (brand_id) {
        qb.andWhere('products.brand_id = :brandId', {
          brandId: brand_id,
        });
      }

      if (min_price !== undefined) {
        qb.andWhere('products.price >= :minPrice', {
          minPrice: min_price,
        });
      }

      if (max_price !== undefined) {
        qb.andWhere('products.price <= :maxPrice', {
          maxPrice: max_price,
        });
      }

      if (is_active !== undefined) {
        qb.andWhere('products.is_active = :isActive', {
          isActive: is_active === 'true',
        });
      }

      if (init_created_at) {
        qb.andWhere('products.created_at >= :initCreatedAt', {
          initCreatedAt: init_created_at,
        });
      }

      if (end_created_at) {
        qb.andWhere('products.created_at <= :endCreatedAt', {
          endCreatedAt: end_created_at,
        });
      }

      qb.orderBy('products.created_at', 'DESC');
      qb.take(limit);
      qb.skip(offset);

      const [products, total] = await qb.getManyAndCount();

      return {
        data: products,
        pagination: {
          total,
          limit,
          skip,
          currentPage: skip,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw httpErrorHandler(error);
    }
  }

  public async findOne(id: string): Promise<Product> {
    try {
      const product: Product | null = await this.productsRepository.findOne({
        where: {
          id: id,
        },
        relations: {
          brand: true,
        },
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          slug: true,
          sizes: true,
          gender: true,
          is_active: true,
          brand: {
            name: true,
          },
          created_at: true,
          updated_at: true,
          deleted_at: true,
        },
      });
      if (!product)
        throw new HttpException(
          'El producto no fue encontrado',
          HttpStatus.NOT_FOUND,
        );
      return product;
    } catch (error) {
      throw httpErrorHandler(error);
    }
  }

  public async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      const { brand_id, ...productData } = updateProductDto;

      let brand: Brand | undefined;

      if (brand_id !== undefined) {
        const foundBrand = await this.brandsRepository.findOne({
          where: { id: brand_id },
        });

        if (!foundBrand) {
          throw new HttpException('La marca no existe.', HttpStatus.NOT_FOUND);
        }

        brand = foundBrand;
      }

      const product = await this.productsRepository.preload({
        id,
        ...productData,
        ...(brand !== undefined ? { brand } : {}),
      });

      if (!product) {
        throw new HttpException(
          'El producto no fue encontrado.',
          HttpStatus.NOT_FOUND,
        );
      }

      return await this.productsRepository.save(product);
    } catch (error: unknown) {
      throw httpErrorHandler(error);
    }
  }
  public async remove(id: string): Promise<Product> {
    try {
      const product = await this.productsRepository.preload({ id: id });
      if (!product)
        throw new HttpException(
          'El producto no fue encontrado.',
          HttpStatus.NOT_FOUND,
        );
      const removed = await this.productsRepository.save({
        ...product,
        is_active: false,
        updated_at: new Date(),
        deleted_at: new Date(),
      });
      return removed;
    } catch (error) {
      throw httpErrorHandler(error);
    }
  }

  public async reactivate(id: string): Promise<Product> {
    try {
      const product = await this.productsRepository.preload({ id: id });
      if (!product)
        throw new HttpException(
          'El producto no fue encontrado.',
          HttpStatus.NOT_FOUND,
        );
      const removed = await this.productsRepository.save({
        ...product,
        is_active: true,
        updated_at: new Date(),
        deleted_at: null,
      });
      return removed;
    } catch (error) {
      throw httpErrorHandler(error);
    }
  }
}
