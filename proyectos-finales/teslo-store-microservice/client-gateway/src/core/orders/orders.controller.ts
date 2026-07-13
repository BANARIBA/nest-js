import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  ParseUUIDPipe,
  Query,
  Patch,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { microservices, orderMessagePatterns } from 'src/common/consts';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs/internal/operators/catchError';
import { OrderResponse } from './types';
import { FindOrdersByDto } from './dto/find-orders-by.dto';
import { ChangeOrderStatusDto } from './dto/change-order-status.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(microservices.ORDERS_MS)
    private readonly ordersClient: ClientProxy,
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient
      .send<{
        message: string;
        order_id: string;
      }>(orderMessagePatterns.CREATE, createOrderDto)
      .pipe(
        catchError((err) => {
          throw new RpcException(err as string | object);
        }),
      );
  }

  @Get()
  findAll(@Query() findOrdersByDto: FindOrdersByDto) {
    return this.ordersClient.send<{
      orders: OrderResponse[];
      total: number;
    }>(orderMessagePatterns.FIND_BY, findOrdersByDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersClient
      .send<OrderResponse>(orderMessagePatterns.FIND_ONE, { id: id })
      .pipe(
        catchError((err) => {
          throw new RpcException(err as string | object);
        }),
      );
  }

  @Patch(':id/check-status')
  checkOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() changeOrderStatusDto: ChangeOrderStatusDto,
  ) {
    return this.ordersClient
      .send<string>(orderMessagePatterns.CHECK_ORDER_STATUS, {
        id: id,
        ...changeOrderStatusDto,
      })
      .pipe(
        catchError((err) => {
          throw new RpcException(err as string | object);
        }),
      );
  }
}
