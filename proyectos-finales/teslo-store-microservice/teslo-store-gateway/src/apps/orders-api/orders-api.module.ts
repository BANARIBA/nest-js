import { Module } from '@nestjs/common';
import { OrdersController } from './controllers/orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ORDER_API_SERVICE } from './consts';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: ORDER_API_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('ORDERS_MS_HOST') ?? 'localhost',
            port: Number(configService.get<string>('PRODUCT_MS_PORT') ?? 3002),
          },
        }),
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [],
})
export class OrdersApiModule {}
