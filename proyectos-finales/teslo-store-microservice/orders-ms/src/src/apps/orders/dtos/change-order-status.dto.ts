import { IsEnum, IsString } from 'class-validator';
import { OrderStatus } from '../enums';

export class ChangeOrderStatusDto {
  @IsString()
  public id!: string;

  @IsEnum(OrderStatus, {
    message: `Valid status: ${OrderStatus.PENDING}, ${OrderStatus.DELIVERED}, ${OrderStatus.CANCELLED}, ${OrderStatus.ALL}`,
  })
  public status!: OrderStatus;
}
