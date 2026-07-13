import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto, ImageFileDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Brand } from '../brands/entities/brand.entity';
import { SearchProducts } from './dto/search-products.dto';
import { defaultPaginationValues } from 'src/common/consts';
import { RpcException } from '@nestjs/microservices';
import { ProductImage } from './entities/product-image.entity';
import { sanitizeFolderName } from 'src/common/utils/sanitize-forder-name.util';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    @InjectRepository(Brand)
    private readonly brandsRepository: Repository<Brand>,
  ) {}

  private saveImageToDisk(
    image: ImageFileDto,
    productFolder: string,
  ): { filePath: string; publicId: string } {
    const uploadDir = path.join(
      process.cwd(),
      'uploads',
      'products',
      productFolder,
    );

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const publicId = crypto.randomUUID();
    const fileName = `${publicId}.${image.extension}`;
    const absolutePath = path.join(uploadDir, fileName);
    const relativePath = path.join(
      'uploads',
      'products',
      productFolder,
      fileName,
    );

    const buffer = Buffer.from(image.buffer, 'base64');
    fs.writeFileSync(absolutePath, buffer);

    return { filePath: relativePath, publicId };
  }

  public async create(
    createProductDto: CreateProductDto,
  ): Promise<{ message: string; product_id: string }> {
    const existsBrand: Brand | null = await this.brandsRepository.findOne({
      where: {
        id: createProductDto.brand_id,
      },
    });
    if (!existsBrand)
      throw new RpcException({
        message: 'Brand not found',
        status: HttpStatus.NOT_FOUND,
      });
    const newProduct: Product = this.productsRepository.create({
      name: createProductDto.name,
      price: createProductDto.price,
      in_stock: createProductDto.in_stock,
      description: createProductDto.description ?? '',
      brand: existsBrand,
    });

    const savedProduct = await this.productsRepository.save(newProduct);

    if (createProductDto.images && createProductDto.images.length > 0) {
      const productFolder = sanitizeFolderName(savedProduct.name);
      const imageEntities: ProductImage[] = createProductDto.images.map(
        (image) => {
          const { filePath, publicId } = this.saveImageToDisk(
            image,
            productFolder,
          );

          return this.productImageRepository.create({
            url: filePath,
            public_id: publicId,
            file_extension: image.extension,
            mime_type: image.mimetype,
            size_bytes: image.size,
            product: savedProduct,
          });
        },
      );

      await this.productImageRepository.save(imageEntities);
    }

    return {
      message: 'Producto creado',
      product_id: savedProduct.id,
    };
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
    if (!product)
      throw new RpcException({
        message: 'Product not found',
        status: HttpStatus.NOT_FOUND,
      });
    return product;
  }

  public async update(id: string, updateProductDto: UpdateProductDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: __, images: ___, ...data } = updateProductDto;
    const product: Product | undefined = await this.productsRepository.preload({
      id: id,
    });
    if (!product)
      throw new RpcException({
        message: 'Product not found',
        status: HttpStatus.NOT_FOUND,
      });
    if (updateProductDto.brand_id) {
      const existsBrand: Brand | null = await this.brandsRepository.findOne({
        where: {
          id: updateProductDto.brand_id,
        },
      });
      if (!existsBrand)
        throw new RpcException({
          message: 'Brand not found',
          status: HttpStatus.NOT_FOUND,
        });
      product.brand = existsBrand;
    }
    return await this.productsRepository.save({
      ...product,
      ...data,
    });
  }

  public async remove(id: string): Promise<Product> {
    const product: Product | undefined = await this.productsRepository.preload({
      id: id,
    });
    if (!product)
      throw new RpcException({
        message: 'Product not found',
        status: HttpStatus.NOT_FOUND,
      });
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
    if (!product)
      throw new RpcException({
        message: 'Product not found',
        status: HttpStatus.NOT_FOUND,
      });
    return await this.productsRepository.save({
      ...product,
      deleted_at: null,
      is_active: true,
    });
  }
}
