import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from 'src/common/dtos';

export class SearchProducts extends PaginationDto {
  @IsOptional()
  @IsString()
  public name?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  public min_price?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  public max_price?: number;

  @IsOptional()
  @IsString()
  public is_active?: string;

  @IsOptional()
  @IsString()
  public brand?: string;

  // Recibimos fechas como string para evitar el desfase automático de JS
  @IsOptional()
  @IsString()
  public init_date?: string;

  @IsOptional()
  @IsString()
  public end_date?: string;
}
