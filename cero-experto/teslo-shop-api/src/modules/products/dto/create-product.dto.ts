import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  price?: number;

  @IsInt()
  @IsOptional()
  @IsPositive()
  @Min(0)
  @Type(() => Number)
  stock?: number;

  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @IsString({ each: true })
  @IsOptional()
  @IsArray()
  tags: string[];

  @IsString({ each: true })
  @IsOptional()
  @IsArray()
  images?: string[];

  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  brand: string;
}
