export interface SearchBook {
  title?: {$regex: string, $options: string};
  description?: {$regex: string, $options: string};
  is_active?: boolean;
}
