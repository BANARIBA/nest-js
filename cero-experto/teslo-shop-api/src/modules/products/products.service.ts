import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { errorHandleException } from 'src/exceptions/error-handle.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import { SearchProductDto } from './dto/search-product.dto';
import { BrandsService } from '../brands/brands.service';
import { Brand } from '../brands/entities/brand.entity';
import { ProductImages } from './entities/product-image.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImages)
    private readonly productImagesRepository: Repository<ProductImages>,
    private readonly dataSource: DataSource,
    private readonly brandsService: BrandsService,
  ) {}

  async create(createProductDto: CreateProductDto, userId: string): Promise<Product> {
    try {
      const { images = [], ...productDetails } = createProductDto;
      const product = this.productRepository.create({
        ...productDetails,
        user: userId,
        images: images.map((image) =>
          this.productImagesRepository.create({ url: image }),
        ),
      });
      return await this.productRepository.save(product);
    } catch (error) {
      return errorHandleException(error);
    }
  }

  async findAll(searcProductDto: SearchProductDto): Promise<Product[]> {
    try {
      const products = this.productRepository.createQueryBuilder('product');

      if (searcProductDto.title) {
        products.andWhere('product.title ILIKE :title', {
          title: `%${searcProductDto.title}%`,
        });
      }

      if (searcProductDto.description) {
        products.andWhere('product.description ILIKE :description', {
          description: `%${searcProductDto.description}%`,
        });
      }

      if (searcProductDto.isActive) {
        products.andWhere('product.isActive =:isActive', {
          isActive: searcProductDto.isActive === 'true' ? true : false,
        });
      }

      if (searcProductDto.brand) {
        products.andWhere('product.brand =:brand', {
          brand: searcProductDto.brand,
        });
      }

      return await products
        .innerJoinAndSelect('product.brand', 'brands')
        .innerJoinAndSelect('product.images', 'product_images')
        .innerJoinAndSelect('product.user', 'users')
        .skip(searcProductDto.limit * searcProductDto.skip)
        .take(searcProductDto.limit)
        .getMany();
    } catch (error) {
      return errorHandleException(error);
    }
  }

  async findOne(id: string): Promise<Product> {
    try {
      const qb = this.productRepository
        .createQueryBuilder('product')
        .andWhere('product.id =:id', { id: id })
        .innerJoinAndSelect('product.brand', 'brands')
        .innerJoinAndSelect('product.images', 'product_images')
        .innerJoinAndSelect('product.user', 'users');
        
      const product = await qb.getOne();
      if (!product) throw new NotFoundException('Product was not found.');
      return product;
    } catch (error) {
      return errorHandleException(error);
    }
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const { images, ...toUpdate } = updateProductDto;
    let brand: Brand;
    if (updateProductDto.brand) {
      brand = await this.brandsService.findOne(updateProductDto.brand);
      if (!brand) throw new NotFoundException('Brand was not found.');
    }
    const product = await this.productRepository.preload({
      id: id,
      ...toUpdate,
    });
    if (!product) throw new NotFoundException('Product was not found.');

    // DEBE INSERTARSE CORRECTAMENTE TODO PARA HACER COMMIT, SI NO SE HACE ROLLBACK
    const queryRunner = this.dataSource.createQueryRunner();

    // Inicializamos
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImages, {
          product: {
            id: id,
          },
        });
        product.images = images.map((img) =>
          this.productImagesRepository.create({ url: img }),
        );
      } else {
        product.images = await this.productImagesRepository.findBy({
          product: { id: id },
        });
      }

      // Guardamos y hacemos commit
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      return product;
    } catch (error) {
      // Si falla hacemos rollback si falla algo
      await queryRunner.rollbackTransaction();
      return errorHandleException(error);
    } finally {
      // Siempre se debe liberar recursos se elimina la conexion al query runner y que deje de funcionar
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<Product> {
    try {
      const product = await this.productRepository.preload({ id: id });
      if (!product) throw new NotFoundException('Product was not found.');
      return await this.productRepository.save({ ...product, isActive: false });
    } catch (error) {
      return errorHandleException(error);
    }
  }
}
