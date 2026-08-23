import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class SearchProductsByDto extends PaginationDto {
  @IsOptional()
  @IsString()
  public name?: string;

  @IsOptional()
  @IsUUID()
  public brand_id?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  public min_price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  public max_price?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  public is_active?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  public created_at?: Date;
}