import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {

  @ApiProperty({
    example: 10,
    description: 'How many rows do you want to see'
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    example: 1,
    description: 'Page that do you want to skip'
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number;

}