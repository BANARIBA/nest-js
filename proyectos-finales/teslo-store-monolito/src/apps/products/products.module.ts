import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Brand } from '../brands/entities/brand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Brand])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
