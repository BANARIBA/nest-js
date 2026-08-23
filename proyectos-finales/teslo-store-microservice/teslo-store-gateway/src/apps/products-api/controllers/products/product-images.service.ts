import {
  Inject,
  Injectable,
} from '@nestjs/common';

import {
  ClientProxy,
  RpcException,
} from '@nestjs/microservices';

import {
  catchError,
  firstValueFrom,
  Observable,
} from 'rxjs';

import { PRODUCT_API_SERVICE } from '../../consts';
import { productsMessagePatterns } from 'src/common/consts';

import {
  DeleteProductImageResponse,
  ProductImageFileRpcResponse,
  ProductImageResponse,
} from './interfaces';

@Injectable()
export class ProductImagesService {
  constructor(
    @Inject(PRODUCT_API_SERVICE)
    private readonly productsAPIServiceClient: ClientProxy,
  ) {}

  public create(
    productId: string,
    file: Express.Multer.File,
    altText?: string,
  ): Observable<ProductImageResponse> {
    return this.send<ProductImageResponse>(
      productsMessagePatterns.CREATE_PRODUCT_IMAGE,
      {
        productId,
        fileName: file.originalname,
        mimeType: file.mimetype,
        fileSize: file.size,
        dataBase64: file.buffer.toString('base64'),
        altText,
      },
    );
  }

  public findAll(
    productId: string,
  ): Observable<ProductImageResponse[]> {
    return this.send<ProductImageResponse[]>(
      productsMessagePatterns.GET_PRODUCT_IMAGES,
      {
        productId,
      },
    );
  }

  public findOne(
    productId: string,
    imageId: string,
  ): Promise<ProductImageFileRpcResponse> {
    return firstValueFrom(
      this.send<ProductImageFileRpcResponse>(
        productsMessagePatterns.GET_PRODUCT_IMAGE,
        {
          productId,
          imageId,
        },
      ),
    );
  }

  public remove(
    productId: string,
    imageId: string,
  ): Observable<DeleteProductImageResponse> {
    return this.send<DeleteProductImageResponse>(
      productsMessagePatterns.DELETE_PRODUCT_IMAGE,
      {
        productId,
        imageId,
      },
    );
  }

  private send<T>(
    command: string,
    payload: unknown,
  ): Observable<T> {
    return this.productsAPIServiceClient
      .send<T>(
        {
          cmd: command,
        },
        payload,
      )
      .pipe(
        catchError((error) => {
          throw new RpcException(error as object);
        }),
      );
  }
}