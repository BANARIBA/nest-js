import { Controller } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ordersMessagePatterns } from 'src/src/common/consts';
import { CreateOrderDto } from './dtos';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern({ cmd: ordersMessagePatterns.CREATE_ORDER })
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @MessagePattern({ cmd: ordersMessagePatterns.FIND_ALL })
  findAll() {
    return 'Obteniendo Ordenes';
  }

  @MessagePattern({ cmd: ordersMessagePatterns.FIND_ONE })
  findOne() {
    return 'Obteniendo Orden';
  }

  @MessagePattern({ cmd: ordersMessagePatterns.CHANGE_ORDER_STATUS })
  changeOrderStatus() {
    return 'Cambiando estado de la orden';
  }
}
