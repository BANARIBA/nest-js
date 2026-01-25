export interface FindBrandResponse {
  id: string;
  name: string;
  is_active: boolean;
  created_at: Date;
  deleted_at: Date | null;
}

export interface FindProductResponse {
  id: string;
  name: string;
  price: string;
  is_active: boolean;
  created_at: Date;
  deleted_at: Date | null;
  brand: FindBrandResponse;
}
