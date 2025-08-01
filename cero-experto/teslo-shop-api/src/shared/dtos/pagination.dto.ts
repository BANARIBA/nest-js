import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  public readonly limit: number = 10;
  
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  public readonly skip: number = 0;
}
