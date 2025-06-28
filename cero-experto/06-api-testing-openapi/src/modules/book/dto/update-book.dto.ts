import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Category } from '../schemas/book.schema';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBookDto extends PartialType(CreateBookDto) {

  @ApiProperty({
    example: 'Clean Code',
    description: 'Product Name',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'For All Programmers',
    description: 'Product Description',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    example: 'Robert C Martin',
    description: 'Product Author',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  author: string;

  @ApiProperty({
    example: 9.99,
    description: 'Product Price',
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 'FANTASY',
    description: 'Product Ccategory, for more details you can see the Category enum',
    nullable: true,
  })
  @IsOptional()
  @IsEnum(Category)
  category: Category;
  
}
