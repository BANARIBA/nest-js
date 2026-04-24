import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  public name!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @Type(() => Number)
  public price!: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  public in_stock!: number;

  @IsOptional()
  @IsString()
  public description?: string;

  @IsString()
  @IsNotEmpty()
  public brand_id!: string;
}
