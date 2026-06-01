import { BrandResponse } from 'src/core/brands/types';

export type ProductImageResponse = {
  id: string;
  url: string;
};

// DTO Principal de Respuesta del Producto
export type ProductResponse = {
  id: string;
  name: string;
  description: string;
  price: number;
  in_stock: number;
  is_active: boolean;
  created_at: Date;
  deleted_at: Date | null;
  brand: BrandResponse;
  images: ProductImageResponse[];
};
