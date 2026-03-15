import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsNumber({
    maxDecimalPlaces: 4,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @Min(0)
  public price: number;

  @IsString()
  @IsNotEmpty()
  public brand: string;
}
