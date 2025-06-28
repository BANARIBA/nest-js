import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class NewAccountDto {

  @ApiProperty({
    example: 'Tony Stark',
    description: 'User complete name',
    nullable: false,
    minLength: 3
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  full_name: string;

  @ApiProperty({
    example: 'tstark@gmail.com',
    description: 'User email',
    nullable: false,
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
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;
}
