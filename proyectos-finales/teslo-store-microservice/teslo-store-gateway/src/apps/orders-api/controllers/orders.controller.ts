import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ORDER_API_SERVICE } from "../consts";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { CreateOrderDto } from "../dtos";
import { ordersMessagePatterns } from "src/common/consts";
import { catchError } from "rxjs";

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
}