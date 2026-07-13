import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ImageFileDto {
  public originalname!: string;
  public mimetype!: string;
  public size!: number; // bytes
  public buffer!: string; // base64 string (serializable por TCP)
  public extension!: string; // 'jpg', 'png', etc.
}

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

  @IsOptional()
  @IsArray()
  public images?: ImageFileDto[];
}
