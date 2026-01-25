import { Module } from '@nestjs/common';
import { ProductsController } from './controllers/products.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCT_SERVICE } from '../../consts';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BrandsController } from './controllers/brands.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: PRODUCT_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('PRODUCT_MS_HOST'),
            port: +configService.get<number>('PRODUCT_MS_PORT')!,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ProductsController, BrandsController],
  providers: [],
})
export class ProductsModule {}
