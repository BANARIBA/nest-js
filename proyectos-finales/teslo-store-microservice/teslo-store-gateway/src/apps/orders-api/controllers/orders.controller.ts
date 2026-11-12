import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ORDER_API_SERVICE } from '../consts';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ChangeOrderStatusDto, CreateOrderDto } from '../dtos';
import { ordersMessagePatterns } from 'src/common/consts';
import { catchError } from 'rxjs';
import { SearchOrdersByDto } from '../dtos/search-orders-by.dto';
@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDER_API_SERVICE)
    private readonly ordersAPIServiceClient: ClientProxy,
  ) {}

  @Post()
  public create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersAPIServiceClient
      .send({ cmd: ordersMessagePatterns.CREATE_ORDER }, createOrderDto)
      .pipe(
        catchError((err) => {
          throw new RpcException(err as object);
        }),
      );
  }

  @Get()
  public findOrders(@Query() searchOrdersByDto: SearchOrdersByDto) {
    return this.ordersAPIServiceClient
      .send({ cmd: ordersMessagePatterns.FIND_ALL }, searchOrdersByDto)
      .pipe(
        catchError((err) => {
          throw new RpcException(err as object);
        }),
      );
  }

  @Get(':order_id')
  public findOrder(@Param('order_id', ParseUUIDPipe) order_id: string) {
    return this.ordersAPIServiceClient
      .send({ cmd: ordersMessagePatterns.FIND_ONE }, { order_id: order_id })
      .pipe(
        catchError((err) => {
          throw new RpcException(err as object);
        }),
      );
  }

  @Patch(':id/change-status')
  public changeOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() changeOrderStatusDto: ChangeOrderStatusDto,
  ) {
    return this.ordersAPIServiceClient
      .send(
        { cmd: ordersMessagePatterns.CHANGE_ORDER_STATUS },
        { id: id, status: changeOrderStatusDto.status },
      )
      .pipe(
        catchError((err) => {
          throw new RpcException(err as object);
        }),
      );
  }
}
