import { Controller } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { orderMessagePatterns } from 'src/common/consts';
import { CreateOrderDto } from './dtos/create-order.dto';
import { FindOrdersByDto } from './dtos/find-orders-by.dto';
import { ChangeOrderStatusDto } from './dtos/change-order-status.dto';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern(orderMessagePatterns.CREATE)
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @MessagePattern(orderMessagePatterns.FIND_BY)
  findAll(@Payload() findOrdersByDto: FindOrdersByDto) {
    return this.ordersService.findAll(findOrdersByDto);
  }

  @MessagePattern(orderMessagePatterns.FIND_ONE)
  findOne(@Payload() { id }: { id: string }) {
    return this.ordersService.findOne(id);
  }

  @MessagePattern(orderMessagePatterns.CHECK_ORDER_STATUS)
  checkOrderStatus(@Payload() changeOrderStatusDto: ChangeOrderStatusDto) {
    return this.ordersService.checkOrderStatus(changeOrderStatusDto);
  }
}
