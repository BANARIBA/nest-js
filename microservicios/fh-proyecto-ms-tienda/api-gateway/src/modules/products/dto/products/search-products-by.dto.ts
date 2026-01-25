import { IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../../common/dtos/pagination.dto';

export class SearchProductByDto extends PaginationDto {
  @IsString()
  @IsOptional()
  public name: string;

  @IsString()
  @IsOptional()
  @IsIn(['true', 'false', ''])
  public is_active: string;

  @IsString()
  @IsOptional()
  public brand: string;
}
