export const PRODUCT_IMAGE_MAX_SIZE_BYTES = 5 * 1024 * 1024;

export const PRODUCT_IMAGE_MAX_BASE64_LENGTH =
  Math.ceil(PRODUCT_IMAGE_MAX_SIZE_BYTES / 3) * 4;

export const PRODUCT_IMAGE_ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;