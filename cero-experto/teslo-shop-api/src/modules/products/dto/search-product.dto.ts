import { IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';

export class SearchProductDto extends PaginationDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  isActive: string;

  @IsOptional()
  @IsUUID()
  brand: string;
}
