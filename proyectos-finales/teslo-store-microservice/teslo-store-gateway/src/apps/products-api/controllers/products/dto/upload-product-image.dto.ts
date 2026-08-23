import {
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UploadProductImageDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  public readonly altText?: string;
}