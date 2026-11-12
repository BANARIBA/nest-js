import { Controller, Inject, ParseUUIDPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ChangeOrderStatusDto, CreateOrderDto, SearchOrdersByDto } from './dtos';
import { ordersMessagePatterns } from '../../common/consts';

@Controller()
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
  ) {}

  @MessagePattern({ cmd: ordersMessagePatterns.CREATE_ORDER })
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @MessagePattern({ cmd: ordersMessagePatterns.FIND_ALL })
  findAll(
    @Payload() searchOrdersByDto: SearchOrdersByDto
  ) {
    return this.ordersService.findAll(searchOrdersByDto);
  }

  @MessagePattern({ cmd: ordersMessagePatterns.FIND_ONE })
  findOne(
    @Payload('order_id', ParseUUIDPipe) order_id: string
  ) {
    return this.ordersService.findOrder(order_id);
  }

  @MessagePattern({ cmd: ordersMessagePatterns.CHANGE_ORDER_STATUS })
  changeOrderStatus(
    @Payload() changeOrderStatusDto: ChangeOrderStatusDto,
  ) {
    return this.ordersService.findOrderAndChangeStatus(changeOrderStatusDto);
  }
}
