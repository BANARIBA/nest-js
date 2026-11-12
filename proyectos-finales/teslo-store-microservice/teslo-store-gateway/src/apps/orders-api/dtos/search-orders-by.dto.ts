import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '../enums';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class SearchOrdersByDto extends PaginationDto {
  @IsOptional()
  @IsEnum(OrderStatus, {
    message: `Valid status: ${OrderStatus.CANCELLED}, ${OrderStatus.DELIVERED}, ${OrderStatus.PENDING}`,
  })
  public status!: OrderStatus;
}
