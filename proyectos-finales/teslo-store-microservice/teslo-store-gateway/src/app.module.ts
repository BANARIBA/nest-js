import { Module } from '@nestjs/common';
import { ProductsApiModule } from './apps/products-api/products-api.module';
import { CommonModule } from './common/common.module';
import { OrdersApiModule } from './apps/orders-api/orders-api.module';
import { AuthApiModule } from './apps/auth-api/auth-api.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env'] }),
    ProductsApiModule,
    CommonModule,
    OrdersApiModule,
    AuthApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
