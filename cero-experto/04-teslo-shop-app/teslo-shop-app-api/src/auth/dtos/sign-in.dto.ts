import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignInDto {

  @ApiProperty({
    example: 'Tony Stark',
    description: 'User complete name',
    nullable: false,
    minLength: 3
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'asd.456',
    description: 'User password',
    nullable: false,
    minLength: 6
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}