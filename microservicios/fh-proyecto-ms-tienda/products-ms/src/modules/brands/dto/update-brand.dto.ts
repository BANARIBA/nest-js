import { PartialType } from '@nestjs/mapped-types';
import { CreateBrandDto } from './create-brand.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {
  @IsNotEmpty()
  @IsString()
  public id: string;
}
