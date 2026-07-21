import {
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  public title!: string;
  @IsString()
  @IsNotEmpty()
  public brand_id!: string;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  public price?: number;
  @IsString()
  @IsOptional()
  public description?: string;
  @IsString()
  @IsOptional()
  public slug?: string;
  @IsInt()
  @IsPositive()
  @IsOptional()
  public stock?: number;
  @IsString({ each: true })
  @IsArray()
  public sizes!: string[];
  @IsString()
  @IsIn(['men', 'women', 'kid', 'unisex'])
  public gender!: string;
}
