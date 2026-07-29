import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsUUID,
} from 'class-validator';
import { PaginationDto } from 'src/core/dtos';

export class SearchProductsByDto extends PaginationDto {
  @IsOptional()
  @IsString()
  public title?: string;

  @IsOptional()
  @IsString()
  public description?: string;

  @IsOptional()
  @IsString()
  public brand_id?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  public min_price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  public max_price?: number;

  @IsOptional()
  @IsIn(['true', 'false'])
  public is_active?: string;

  @IsOptional()
  @IsDateString()
  public init_created_at?: string;

  @IsOptional()
  @IsDateString()
  public end_created_at?: string;
}