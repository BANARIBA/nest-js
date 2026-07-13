import { Module } from '@nestjs/common';
import { BrandsModule } from './brands/brands.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [BrandsModule, ProductsModule, OrdersModule],
})
export class CoreModule {}
