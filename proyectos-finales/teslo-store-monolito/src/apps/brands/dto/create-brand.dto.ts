import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  public name!: string;
}
