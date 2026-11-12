import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '../enums';

export class ChangeOrderStatusDto {
  @IsOptional()
  @IsEnum(OrderStatus, {
    message: `Valid status: ${OrderStatus.CANCELLED}, ${OrderStatus.DELIVERED}, ${OrderStatus.PENDING}`,
  })
  public status!: OrderStatus;
}
