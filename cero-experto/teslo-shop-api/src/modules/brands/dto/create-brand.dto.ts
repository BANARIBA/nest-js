import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  public readonly name: string;
}
