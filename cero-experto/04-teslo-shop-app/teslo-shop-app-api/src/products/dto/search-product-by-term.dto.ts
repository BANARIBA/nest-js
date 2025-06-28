import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, IsString, Min } from "class-validator";

export class SearchProductByDto {
  
  @ApiProperty({
    example: 'Tshirt',
    description: 'Title of product do you want to search',
  })
  @IsOptional()
  @IsString()
  title?: string;
  
    
  @ApiProperty({
    example: 'Clothes for summer',
    description: 'Description of product do you want to search',
  })
  @IsOptional()
  @IsString()
  description?: string;

    
  @ApiProperty({
    example: 't_shirt',
    description: 'Slug of product do you want to search',
  })
  @IsOptional()
  @IsString()
  slug?: string;

    
  @ApiProperty({
    example: 10,
    description: 'How many rows do you want to see',
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    example: 1,
    description: 'Page that do you want to skip',
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number;
  
}