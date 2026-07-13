import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

export class ChangeOrderStatusDto {
  @IsNotEmpty()
  @IsString()
  public id!: string;

  @IsNotEmpty()
  @IsEnum(OrderStatus, {
    message: `Status must be one of the following values: ${Object.values(OrderStatus).join(', ')}`,
  })
  public status!: OrderStatus;
}
