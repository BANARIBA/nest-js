import { PaginationDto } from 'src/common/dtos';
import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

export class FindOrdersByDto extends PaginationDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  public status?: OrderStatus;
}
