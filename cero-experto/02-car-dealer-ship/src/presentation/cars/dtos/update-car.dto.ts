import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateCarDto {

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public readonly brand: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public readonly model: string;
}
