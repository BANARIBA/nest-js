import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {validate as isUUID} from 'uuid';

import { Product } from './entities/product.entity';
import { handleExceptions } from 'src/config';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { SearchProductBy } from './interfaces';
import { ProductImage } from './entities/product-image.entity';
import { User } from 'src/users/entities/user.entity';


@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    try {
      const {images = [], ...productDetails} = createProductDto;
      const product = this.productRepository.create({
        ...productDetails,
        user: user,
        images: images.map(
          (image) => this.productImageRepository.create({url: image})
        ),
      });
      await this.productRepository.save(product);
      return {...product, images: images,};
    } catch (error) {
      handleExceptions(error);
    }
  }
  
  async findAll(limit: number = 10, offset: number = 0, searchProductBy: SearchProductBy) {
    try {
      // console.log(searchProductBy)
      // const queryBuilder = this.productRepository.createQueryBuilder();
      const [products, totalProducts] = await Promise.all([
        this.productRepository.find({
          where: [],
          take: limit,
          skip: offset,
          relations: {
            images: true,
          },
        }),
        this.productRepository.count(),
      ]);
      return {
        totalData: totalProducts,
        data: products.map(
          product => ({
          ...product,
          images: product.images.map(image => image.url),
        })),
      };
    } catch (error) {
      handleExceptions(error);
    }
  }

  async findOne(term: string) {
    try {
      let existsProduct: Product;
      if (isUUID(term)) {
        existsProduct = await this.productRepository.findOneBy({id: term});
      } else {
        const queryBuilder = this.productRepository.createQueryBuilder('prod');
        existsProduct = await queryBuilder
          .where('lower(title)=lower(:title) or lower(slug)=lower(:slug)', {title: term, slug: term})
          .leftJoinAndSelect('prod.images', 'prodImages')
          .getOne();
      }
      if (!existsProduct) throw new HttpException(`Product not found`, HttpStatus.NOT_FOUND);
      return existsProduct;

    } catch (error) {
      handleExceptions(error);
    }
  }

  async update(product_id: string, updateProductDto: UpdateProductDto, user: User) {
    const {images, ...toUpdate} = updateProductDto;
    
    // Estas manejan transacciones
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existsProduct = await this.productRepository.preload({
        id: product_id, 
        ...toUpdate,
      });
      if (!existsProduct) throw new HttpException(`Product not found`, HttpStatus.NOT_FOUND);

      // Si vienen imagenes en el dto, debemos borrar las almacenadas anteriormente
      if (images) {
        await queryRunner.manager.delete(ProductImage, {product: {id: product_id}});

        // Y creamos las imagenes provenientes del dto
        existsProduct.images = images.map(image => this.productImageRepository.create({url: image}));
      } else {
        // Esto lo hace el finOnePlane() existsProduct.images = await this.productImageRepository.findBy({product: {id: product_id}});
      }

      // Guardamos el producto actualizado con las imagenes
      existsProduct.user = user;
      await queryRunner.manager.save(existsProduct);

      // Hacemos commit
      await queryRunner.commitTransaction();
      return this.findOnePlane(existsProduct.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      handleExceptions(error);
    } finally {
      // Cerramos conexion
      await queryRunner.release();
    }
  }

  async remove(product_id: string) {
    try {
      const existsProduct = await this.productRepository.findOneBy({id: product_id});
      if (!existsProduct) throw new HttpException(`Product not found`, HttpStatus.NOT_FOUND);
      return await this.productRepository.remove(existsProduct);
    } catch (error) {
      handleExceptions(error);
    }
  }

  async findOnePlane (term: string) {
    const {images = [], ...product} = await this.findOne(term);
    return {
      ...product,
      images: images.map(image => image.url),
    };
  }

  async deleteAllProducts () {
    const query = this.productRepository.createQueryBuilder('product');
    try {
      return await query
        .delete()
        .where({})
        .execute();
    } catch (error) {
      handleExceptions(error);
    }
  }
}

