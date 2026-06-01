import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '../enums';

export class ChangeOrderStatusDto {
  @IsNotEmpty()
  @IsEnum(OrderStatus, {
    message: `Status must be one of the following values: ${Object.values(OrderStatus).join(', ')}`,
  })
  public status!: OrderStatus;
}
