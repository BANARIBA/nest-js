import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dtos';

export class FindByDto extends PaginationDto {
  @IsOptional()
  @IsString()
  public readonly name?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  public readonly is_active?: boolean;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  public readonly init_date?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  public readonly end_date?: Date;
}
