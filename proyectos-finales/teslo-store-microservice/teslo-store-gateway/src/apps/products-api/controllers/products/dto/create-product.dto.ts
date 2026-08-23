import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsPositive, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  public readonly name!: string;

  @IsNotEmpty()
  @IsNumber({
    maxDecimalPlaces: 4,
  })
  @Type(() => Number)
  @IsPositive()
  @Min(0)
  public readonly price!: number;

  @IsNotEmpty()
  @IsString()
  public readonly brand!: string;
}
