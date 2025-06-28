import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class NewMessageDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  id: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  message: string;
}
