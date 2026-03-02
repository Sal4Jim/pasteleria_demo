export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  emoji: string;
  active: boolean;
  stock: number;
  created_at?: string;
}

export interface CartItem extends Product {
  quantity: number;
}
