import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Category } from '../schemas/book.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {

  @ApiProperty({
    example: 'Clean Code',
    description: 'Product Name',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'For All Programmers',
    description: 'Product Description',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: 'Robert C Martin',
    description: 'Product Author',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  author: string;
  
  @ApiProperty({
    example: 9.99,
    description: 'Product Price',
    nullable: false,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 'FANTASY',
    description: 'Product Ccategory, for more details you can see the Category enum',
    nullable: false,
  })
  @IsNotEmpty()
  @IsEnum(Category)
  category: Category;
}
