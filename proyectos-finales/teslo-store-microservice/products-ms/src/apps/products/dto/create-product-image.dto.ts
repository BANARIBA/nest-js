import { Type } from 'class-transformer';
import {
  IsBase64,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import {
  PRODUCT_IMAGE_ALLOWED_MIME_TYPES,
  PRODUCT_IMAGE_MAX_SIZE_BYTES,
} from '../constants/product-images.constants';

export class CreateProductImageDto {
  @IsUUID()
  public readonly productId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  public readonly fileName!: string;

  @IsString()
  @IsIn([...PRODUCT_IMAGE_ALLOWED_MIME_TYPES])
  public readonly mimeType!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(PRODUCT_IMAGE_MAX_SIZE_BYTES)
  public readonly fileSize!: number;

  @IsString()
  @IsNotEmpty()
  @IsBase64()
  public readonly dataBase64!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  public readonly altText?: string;
}