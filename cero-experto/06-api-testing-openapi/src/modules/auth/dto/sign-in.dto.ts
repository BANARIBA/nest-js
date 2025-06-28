import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignInDto {

  @ApiProperty({
    description: 'Email that the user needs to do sign in',
    example: 'testOne@gmail.com',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public readonly email: string;

  @ApiProperty({
    description: 'Password that the user needs to do sign in',
    example: '******',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  public readonly password: string;
}