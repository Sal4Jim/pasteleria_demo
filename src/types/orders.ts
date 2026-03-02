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

export interface OrderInsert {
  vendor_id: string;
  subtotal: number;
  tax: number;
  total: number;
  payment_method: string;
  invoice: boolean;
}

export interface OrderItemInsert {
  order_id: string;
  product_id?: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}
