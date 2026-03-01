export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  emoji: string | null;
  active: boolean;
  created_at: string;
}

export interface CartItem extends Product {
  quantity: number;
}
