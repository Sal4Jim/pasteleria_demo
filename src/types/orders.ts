export interface OrderWithItems {
  id: string;
  vendor_id: string;
  vendor_name: string;
  total: number;
  subtotal: number;
  tax: number;
  payment_method: string;
  invoice: boolean;
  created_at: string;
  items: { product_name: string; quantity: number; unit_price: number; total_price: number }[];
}
