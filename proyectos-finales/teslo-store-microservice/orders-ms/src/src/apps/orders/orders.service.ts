import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dtos/create-order.dto';
import { RpcException, ClientProxy } from '@nestjs/microservices';
import { ChangeOrderStatusDto, SearchOrdersByDto } from './dtos';
import { PRODUCT_API_SERVICE } from './consts';
import { productsMessagePatterns } from 'src/src/common/consts';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @Inject(PRODUCT_API_SERVICE)
    private readonly productsAPIServiceClient: ClientProxy,
  ) {}

  public async createOrder(createOrderDto: CreateOrderDto) {
    try {
      const productIds: string[] = createOrderDto.items.map(
        (i) => i.product_id,
      );
      const products = await firstValueFrom(
        this.productsAPIServiceClient.send(
          { cmd: productsMessagePatterns.VALIDATE_PRODUCTS },
          productIds,
        ),
      );

      // TODO: calculo de valores
      const totalAmount = createOrderDto.items.reduce((acc, orderItem) => {
        const price = +products.find((p) => p.id === orderItem.product_id)
          .price;
        return price * orderItem.quantity + acc;
      }, 0);

      const totalItems = createOrderDto.items.reduce((acc, orderItem) => {
        return acc + orderItem.quantity;
      }, 0);

      const order = this.ordersRepository.create({
        total_amoung: totalAmount,
        total_items: totalItems,
        order_details: createOrderDto.items.map((orderDetail) => ({
          price: +products.find((p) => p.id === orderDetail.product_id).price,
          quantity: orderDetail.quantity,
          product_id: orderDetail.product_id,
        })),
      });

      const orderSaved = await this.ordersRepository.save(order);
      return orderSaved;
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Error creating order, please check logs.',
      });
    }
  }

  public async findOrder(order_id: string) {
    const qb = this.ordersRepository.createQueryBuilder('order');
    qb.innerJoinAndSelect('order.order_details', 'order_details');
    qb.andWhere('order.id =:order_id', { order_id: order_id });
    const order = await qb.getOne();
    if (!order)
      throw new RpcException({
        message: `Order with id ${order_id} not found.`,
        status: HttpStatus.NOT_FOUND,
      });
    const products = await firstValueFrom(
      this.productsAPIServiceClient.send(
        { cmd: productsMessagePatterns.VALIDATE_PRODUCTS },
        order.order_details.map((od) => od.product_id),
      ),
    );
    return {
      ...order,
      order_details: order.order_details.map((order_detail) => ({
        ...order_detail,
        product_name: products.find(product => product.id === order_detail.product_id).name,
      })),
    }
  }

  public async findAll(searchOrdersByDto: SearchOrdersByDto) {
    const { limit = 10, skip = 0, status } = searchOrdersByDto;
    const offset = limit * skip;
    const query = this.ordersRepository.createQueryBuilder('orders');
    if (status !== 'ALL') {
      query.andWhere('orders.status =:status', { status: status });
    }
    query.orderBy('orders.created_at', 'DESC').skip(offset).take(limit);
    const [data, totalRecords] = await query.getManyAndCount();
    return {
      data,
      totalRecords,
    };
  }

  public async findOrderAndChangeStatus(
    changeOrderStatusDto: ChangeOrderStatusDto,
  ) {
    const order = await this.ordersRepository.preload({
      id: changeOrderStatusDto.id,
      status: changeOrderStatusDto.status,
    });
    if (!order)
      throw new RpcException({
        message: `Order with id ${changeOrderStatusDto.id} not found.`,
        status: HttpStatus.NOT_FOUND,
      });
    return await this.ordersRepository.save(order);
  }
}
