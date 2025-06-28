import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {

  @ApiProperty({
    example: 't shirt',
    description: 'Product Name',
    nullable: false,
    maxLength: 3
  })
  @IsString()
  @MinLength(3)
  public title: string;

  @ApiProperty({
    example: 10.99,
    description: 'Product Price',
    nullable: false,
    maxLength: 3
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  public price?: number;

  @ApiProperty({
    example: 'clothes for summer',
    description: 'Product Description'
  })
  @IsString()
  @IsOptional()
  public description?: string;

  @ApiProperty({
    example: 't_shirt',
    description: 'Product slug'
  })
  @IsString()
  @IsOptional()
  public slug?: string;

  @ApiProperty({
    example: 10,
    description: 'Product quantity'
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  public stock?: number;


  @ApiProperty({
    example: '["XS","S","M","L","XL","XXL"]',
    description: 'Product sizes'
  })
  @IsString({ each: true })
  @IsArray()
  public sizes: string[];

  @ApiProperty({
    example: '"women"',
    description: 'Gender for this product can use'
  })
  @IsIn(['men', 'women', 'kid', 'unisex'])
  public gender: string;

  @ApiProperty({
    example: '"shirt"',
    description: 'Clothes type'
  })
  @IsString({each: true})
  @IsArray()
  public tags: string[];

  @ApiProperty({
    example: '["https://image-1.png", "http://image-2.png"]',
    description: 'Product Images'
  })
  @IsString({each: true})
  @IsArray()
  @IsOptional()
  public images?: string[];

}
