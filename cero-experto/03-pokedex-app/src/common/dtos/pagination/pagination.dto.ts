import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {

  @IsOptional()
  @IsInt()
  @IsPositive()
  limit: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  offset: number;
}
