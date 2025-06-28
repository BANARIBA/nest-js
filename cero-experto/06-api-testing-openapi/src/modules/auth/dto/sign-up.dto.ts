import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class SignUpDto {

  @ApiProperty({
    description: 'User complete name that wants to create the account',
    example: 'Goku Smith',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  public readonly name: string;

  @ApiProperty({
    description: 'User email that wants to create the account',
    example: 'goku@gmail.com',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public readonly email: string;

  @ApiProperty({
    description: 'User password that wants to create the account',
    example: '******',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  public readonly password: string;
  
}