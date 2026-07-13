export type OrderResponse = {
  id: string;
  total_amount: number;
  total_items: number;
  status: string;
  paid: boolean;
  paid_at: Date | null;
  created_at: Date;
  updated_at: Date | null;
};
