import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderDetails } from './entities/order-details.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PRODUCT_API_SERVICE } from './consts';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetails]),
    ClientsModule.registerAsync([
      {
        name: PRODUCT_API_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('PRODUCTS_MS_HOST') ?? 'localhost',
            port: Number(configService.get<string>('PRODUCT_MS_PORT') ?? 3001),
          },
        }),
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
