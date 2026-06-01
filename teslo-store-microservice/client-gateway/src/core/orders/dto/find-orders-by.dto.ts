import { PaginationDto } from 'src/common/dtos';
import { OrderStatus } from '../enums';
import { IsEnum, IsOptional } from 'class-validator';

export class FindOrdersByDto extends PaginationDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  public status?: OrderStatus;
}
