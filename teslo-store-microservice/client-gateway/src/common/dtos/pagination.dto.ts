import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  public limit!: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  public skip!: number;
}
