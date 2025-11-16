import { Module } from '@nestjs/common';
import { ProductsModule } from './modules/products/products.module';
import { BrandsModule } from './modules/brands/brands.module';
import { CommonModule } from './common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ProductsModule,
    BrandsModule,
    CommonModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('PRODUCTS_MS_DATABASE_HOST'),
        port: config.get<number>('PRODUCTS_MS_DATABASE_PORT'),
        username: config.get('PRODUCTS_MS_DATABASE_USERNAME'),
        password: config.get('PRODUCTS_MS_DATABASE_PASSWORD'),
        database: config.get('PRODUCTS_MS_DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
