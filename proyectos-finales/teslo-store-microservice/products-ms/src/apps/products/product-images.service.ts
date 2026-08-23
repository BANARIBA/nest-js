import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';

import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-images.entity';
import { CreateProductImageDto } from './dto/create-product-image.dto';

import {
  PRODUCT_IMAGE_ALLOWED_MIME_TYPES,
  PRODUCT_IMAGE_MAX_BASE64_LENGTH,
  PRODUCT_IMAGE_MAX_SIZE_BYTES,
} from './constants/product-images.constants';

import {
  DeleteProductImageResponse,
  ProductImageFileResponse,
  ProductImageResponse,
} from './interfaces';

@Injectable()
export class ProductImagesService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImagesRepository: Repository<ProductImage>,
  ) {}

  public async create(
    createProductImageDto: CreateProductImageDto,
  ): Promise<ProductImageResponse> {
    const {
      productId,
      fileName,
      mimeType,
      fileSize,
      dataBase64,
      altText,
    } = createProductImageDto;

    const product = await this.productsRepository.findOne({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new RpcException({
        message: 'Product Not Found',
        status: HttpStatus.NOT_FOUND,
      });
    }

    if (
      !PRODUCT_IMAGE_ALLOWED_MIME_TYPES.some(
        (allowedMimeType) => allowedMimeType === mimeType,
      )
    ) {
      throw new RpcException({
        message: 'Unsupported image type',
        status: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      });
    }

    if (dataBase64.length > PRODUCT_IMAGE_MAX_BASE64_LENGTH) {
      throw new RpcException({
        message: 'Image exceeds the maximum allowed size',
        status: HttpStatus.PAYLOAD_TOO_LARGE,
      });
    }

    const data = Buffer.from(dataBase64, 'base64');

    if (data.length === 0) {
      throw new RpcException({
        message: 'Image file is empty',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    if (data.length > PRODUCT_IMAGE_MAX_SIZE_BYTES) {
      throw new RpcException({
        message: 'Image exceeds the maximum allowed size',
        status: HttpStatus.PAYLOAD_TOO_LARGE,
      });
    }

    if (data.length !== fileSize) {
      throw new RpcException({
        message: 'Image size does not match the received file',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const normalizedFileName = fileName
      .replace(/[\r\n]/g, '')
      .trim()
      .slice(0, 255);

    if (!normalizedFileName) {
      throw new RpcException({
        message: 'Invalid file name',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const newProductImage = this.productImagesRepository.create({
      fileName: normalizedFileName,
      mimeType,
      fileSize: data.length,
      data,
      altText: altText?.trim() || undefined,
      product,
    });

    const savedImage =
      await this.productImagesRepository.save(newProductImage);

    return this.toResponse(savedImage, productId);
  }

  public async findAll(
    productId: string,
  ): Promise<ProductImageResponse[]> {
    await this.validateProductExists(productId);

    const images = await this.productImagesRepository
      .createQueryBuilder('image')
      .innerJoin('image.product', 'product')
      .where('product.id = :productId', {
        productId,
      })
      .orderBy('image.createdAt', 'DESC')
      .getMany();

    return images.map((image) =>
      this.toResponse(image, productId),
    );
  }

  public async findOne(
    productId: string,
    imageId: string,
  ): Promise<ProductImageFileResponse> {
    const image = await this.productImagesRepository
      .createQueryBuilder('image')
      .addSelect('image.data')
      .innerJoin('image.product', 'product')
      .where('image.id = :imageId', {
        imageId,
      })
      .andWhere('product.id = :productId', {
        productId,
      })
      .getOne();

    if (!image) {
      throw new RpcException({
        message: 'Product Image Not Found',
        status: HttpStatus.NOT_FOUND,
      });
    }

    return {
      ...this.toResponse(image, productId),
      dataBase64: image.data.toString('base64'),
    };
  }

  public async remove(
    productId: string,
    imageId: string,
  ): Promise<DeleteProductImageResponse> {
    const image = await this.productImagesRepository
      .createQueryBuilder('image')
      .innerJoin('image.product', 'product')
      .where('image.id = :imageId', {
        imageId,
      })
      .andWhere('product.id = :productId', {
        productId,
      })
      .getOne();

    if (!image) {
      throw new RpcException({
        message: 'Product Image Not Found',
        status: HttpStatus.NOT_FOUND,
      });
    }

    await this.productImagesRepository.delete(image.id);

    return {
      id: image.id,
      message: 'Product image deleted permanently',
    };
  }

  private async validateProductExists(
    productId: string,
  ): Promise<void> {
    const product = await this.productsRepository.findOne({
      where: {
        id: productId,
      },
      select: {
        id: true,
      },
    });

    if (!product) {
      throw new RpcException({
        message: 'Product Not Found',
        status: HttpStatus.NOT_FOUND,
      });
    }
  }

  private toResponse(
    image: ProductImage,
    productId: string,
  ): ProductImageResponse {
    return {
      id: image.id,
      productId,
      fileName: image.fileName,
      mimeType: image.mimeType,
      fileSize: image.fileSize,
      altText: image.altText ?? null,
      createdAt: image.createdAt.toISOString(),
      updatedAt: image.updatedAt.toISOString(),
    };
  }
}