import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  public readonly limit?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  public readonly page?: number;
}
