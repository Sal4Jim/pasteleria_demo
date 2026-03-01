export interface Product {
  id: string;
  name: string;
  price: number;
  category: "cakes" | "cupcakes" | "beverages" | "custom";
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  time: string;
  products: string[];
  vendor: string;
  total: number;
  paymentMethod: "cash" | "card" | "yape";
  invoice: boolean;
}

export const products: Product[] = [
  { id: "1", name: "Tres Leches", price: 12.50, category: "cakes", image: "🎂" },
  { id: "2", name: "Torta de Chocolate", price: 14.00, category: "cakes", image: "🍫" },
  { id: "3", name: "Cheesecake de Maracuyá", price: 13.50, category: "cakes", image: "🍰" },
  { id: "4", name: "Torta Red Velvet", price: 15.00, category: "cakes", image: "❤️" },
  { id: "5", name: "Cupcake Vainilla", price: 5.50, category: "cupcakes", image: "🧁" },
  { id: "6", name: "Cupcake Chocolate", price: 5.50, category: "cupcakes", image: "🧁" },
  { id: "7", name: "Cupcake Red Velvet", price: 6.00, category: "cupcakes", image: "🧁" },
  { id: "8", name: "Cupcake Zanahoria", price: 6.00, category: "cupcakes", image: "🥕" },
  { id: "9", name: "Café Americano", price: 6.00, category: "beverages", image: "☕" },
  { id: "10", name: "Cappuccino", price: 8.00, category: "beverages", image: "☕" },
  { id: "11", name: "Latte de Vainilla", price: 9.00, category: "beverages", image: "🥛" },
  { id: "12", name: "Chocolate Caliente", price: 7.50, category: "beverages", image: "🍫" },
  { id: "13", name: "Matcha Latte", price: 10.00, category: "beverages", image: "🍵" },
  { id: "14", name: "Frappuccino Mocha", price: 12.00, category: "beverages", image: "🧊" },
];

export const sampleOrders: Order[] = [
  { id: "ORD-001", time: "08:15", products: ["Café Americano", "Cupcake Vainilla"], vendor: "María López", total: 11.50, paymentMethod: "yape", invoice: false },
  { id: "ORD-002", time: "09:30", products: ["Tres Leches"], vendor: "Carlos Ruiz", total: 12.50, paymentMethod: "cash", invoice: true },
  { id: "ORD-003", time: "10:00", products: ["Cappuccino", "Torta de Chocolate"], vendor: "María López", total: 22.00, paymentMethod: "card", invoice: false },
  { id: "ORD-004", time: "10:45", products: ["Cupcake Red Velvet", "Cupcake Chocolate"], vendor: "Ana Torres", total: 11.50, paymentMethod: "yape", invoice: false },
  { id: "ORD-005", time: "11:20", products: ["Latte de Vainilla", "Cheesecake de Maracuyá"], vendor: "Carlos Ruiz", total: 22.50, paymentMethod: "cash", invoice: true },
  { id: "ORD-006", time: "12:00", products: ["Matcha Latte"], vendor: "María López", total: 10.00, paymentMethod: "card", invoice: false },
  { id: "ORD-007", time: "13:15", products: ["Torta Red Velvet", "Café Americano"], vendor: "Ana Torres", total: 21.00, paymentMethod: "yape", invoice: true },
  { id: "ORD-008", time: "14:30", products: ["Frappuccino Mocha", "Cupcake Zanahoria"], vendor: "Carlos Ruiz", total: 18.00, paymentMethod: "cash", invoice: false },
  { id: "ORD-009", time: "15:00", products: ["Chocolate Caliente", "Tres Leches"], vendor: "María López", total: 20.00, paymentMethod: "card", invoice: true },
  { id: "ORD-010", time: "16:45", products: ["Cappuccino", "Cupcake Vainilla", "Cupcake Chocolate"], vendor: "Ana Torres", total: 19.00, paymentMethod: "yape", invoice: false },
];
