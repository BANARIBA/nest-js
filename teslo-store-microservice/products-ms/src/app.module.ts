import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BrandsModule } from './brands/brands.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>(
          'PRODUCTS_MICROSERVICE_DBHOST',
          'localhost',
        ),
        port: configService.get<number>('PRODUCTS_MICROSERVICE_DBPORT', 5432),
        username: configService.get<string>('PRODUCTS_MICROSERVICE_USERNAME'),
        password: configService.get<string>('PRODUCTS_MICROSERVICE_PASSWORD'),
        database: configService.get<string>('PRODUCTS_MICROSERVICE_DBNAME'),
        autoLoadEntities: true, // Carga automáticamente las entidades registradas en los módulos
        synchronize: true, // Sincroniza las tablas con tus entidades (solo para DESARROLLO)
        // Configuración extra para asegurar compatibilidad con versiones nuevas de Postgres
        logging: true,
      }),
    }),
    ProductsModule,
    CommonModule,
    BrandsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
