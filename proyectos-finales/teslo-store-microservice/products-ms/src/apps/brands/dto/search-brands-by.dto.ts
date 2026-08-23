import { Type } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class SearchBrandsByDto extends PaginationDto {
  @IsOptional()
  @IsString()
  public name?: string;

  @IsOptional()
  @IsIn(['true', 'false'])
  public is_active?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  public created_at?: Date;
}