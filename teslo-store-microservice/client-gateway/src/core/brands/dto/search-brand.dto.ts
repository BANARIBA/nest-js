import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dtos';

export class SearchBrandDto extends PaginationDto {
  @IsOptional()
  @IsString()
  public name?: string;

  @IsOptional()
  @IsString()
  public description?: string;

  @IsOptional()
  @IsString()
  public is_active?: string;

  @IsOptional()
  @IsString()
  public init_date?: string;

  @IsOptional()
  @IsString()
  public end_date?: string;
}
