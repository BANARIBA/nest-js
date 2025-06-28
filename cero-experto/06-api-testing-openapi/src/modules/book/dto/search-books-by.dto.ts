import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, Min } from 'class-validator';

export class SearchBookByDto {

  @ApiProperty({
    example: 10,
    description: 'How many books do you want to see in the response of the request',
    nullable: true,
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  limit: number;

  @ApiProperty({
    example: 'clean',
    description: 'If you want to search by book name, you should want to write the name, in the request the upper or camel case really do not care',
    nullable: true
  })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'for all programmers',
    description: 'If yout want to search by book description, you should want to write the description, in the request the upper or camel case really do not care',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  description: string

  @ApiProperty({
    example: 2,
    description: 'If there are 20 records and the limit is 10, you can only see the 10 first recors, but with the skip you can see the next 10 records, is used for paginations',
    nullable: true,
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  skip: number;

  @ApiProperty({
    example: 'true',
    description: 'You can see the deleted or active books records, if you put true, you can see the active records, else deleted records',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  is_active: string;
}
