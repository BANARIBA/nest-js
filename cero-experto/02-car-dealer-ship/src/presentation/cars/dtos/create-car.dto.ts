import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCarDto {
  @IsString()
  @IsNotEmpty()
  public readonly brand: string;

  @IsString()
  @IsNotEmpty()
  public readonly model: string;
}
