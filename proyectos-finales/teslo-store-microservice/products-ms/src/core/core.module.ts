import { Module } from '@nestjs/common';
import { BrandsModule } from './brands/brands.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [BrandsModule, ProductsModule],
})
export class CoreModule {}
