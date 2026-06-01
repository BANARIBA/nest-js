import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../enums';

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Type(() => Number)
  public total_amount!: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Type(() => Number)
  public total_items!: number;

  @IsEnum(
    [
      OrderStatus.PENDING,
      OrderStatus.CONFIRMED,
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
      OrderStatus.CANCELLED,
    ],
    {
      message: `status must be a valid OrderStatus ${
        OrderStatus.PENDING +
        ',' +
        OrderStatus.CONFIRMED +
        ',' +
        OrderStatus.SHIPPED +
        ',' +
        OrderStatus.DELIVERED +
        ',' +
        OrderStatus.CANCELLED
      }`,
    },
  )
  @IsOptional()
  public status: OrderStatus = OrderStatus.PENDING;

  @IsOptional()
  @Type(() => Boolean)
  public paid: boolean = false;
}
