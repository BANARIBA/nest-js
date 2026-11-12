import { Type } from 'class-transformer';
import { IsNumber, IsPositive, IsUUID, Min } from 'class-validator';

export class OrderItemDto {
  @IsUUID(4)
  public product_id!: string;

  @IsNumber()
  @IsPositive()
  @Min(0)
  @Type(() => Number)
  public quantity!: number;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  public price!: number;
}
