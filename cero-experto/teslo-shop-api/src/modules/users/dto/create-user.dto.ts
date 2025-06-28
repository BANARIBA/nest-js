import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public readonly email: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  public readonly password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  public readonly fullName: string;
}
