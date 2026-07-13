import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBrandDto {
  @IsNotEmpty()
  @IsString()
  public name!: string;

  @IsOptional()
  @IsString()
  public description?: string;
}
