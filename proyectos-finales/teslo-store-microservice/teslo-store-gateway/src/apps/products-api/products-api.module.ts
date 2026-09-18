import { Module } from '@nestjs/common';
import { ProductsController } from './controllers/products/products.controller';
import { BrandsController } from './controllers/brands/brands.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCT_API_SERVICE } from './consts';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductImagesController } from './controllers/products/product-images.controller';
import { ProductImagesService } from './controllers/products/product-images.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: PRODUCT_API_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('PRODUCTS_MS_HOST') ?? 'localhost',
            port: Number(configService.get<string>('PRODUCTS_MS_PORT') ?? 3001),
          },
        }),
      },
    ]),
  ],
  controllers: [ProductsController, ProductImagesController, BrandsController],
  providers: [ProductImagesService],
})
export class ProductsApiModule {}
