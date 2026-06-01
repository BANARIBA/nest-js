import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dtos/create-order.dto';
import { RpcException } from '@nestjs/microservices';
import { FindOrdersByDto } from './dtos/find-orders-by.dto';
import { defaultPaginationValues } from 'src/common/consts';
import { ChangeOrderStatusDto } from './dtos/change-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  public async create(
    createOrderDto: CreateOrderDto,
  ): Promise<{ message: string; order_id: string }> {
    const order = this.orderRepository.create(createOrderDto);
    const saved = await this.orderRepository.save(order);
    return {
      message: 'Order created succesfully',
      order_id: saved.id,
    };
  }

  public async findAll(findOrdersByDto: FindOrdersByDto): Promise<{
    orders: Order[];
    total: number;
  }> {
    const {
      status,
      limit = defaultPaginationValues.limit,
      skip = defaultPaginationValues.skip,
    } = findOrdersByDto;
    const queryBuilder = this.orderRepository.createQueryBuilder('order');

    if (status) {
      queryBuilder.where('order.status = :status', { status });
    }
    queryBuilder.skip(skip * limit).take(limit);
    const [orders, total] = await queryBuilder.getManyAndCount();
    return { orders, total };
  }

  public async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
    });
    if (!order)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Order with id ${id} not found`,
      });

    return order;
  }

  public async checkOrderStatus(changeOrderStatusDto: ChangeOrderStatusDto) {
    const order = await this.orderRepository.preload({
      id: changeOrderStatusDto.id,
    });
    if (!order)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Order with id ${changeOrderStatusDto.id} not found`,
      });
    return await this.orderRepository.save({
      ...order,
      status: changeOrderStatusDto.status,
      paid:
        changeOrderStatusDto.status === OrderStatus.CONFIRMED ? true : false,
      updated_at: new Date(),
    });
  }
}
