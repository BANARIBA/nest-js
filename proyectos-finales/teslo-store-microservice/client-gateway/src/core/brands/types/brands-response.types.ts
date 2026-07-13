export type BrandResponse = {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;
  deleted_at: Date | null;
};
