import { useState } from "react";
import { type Product, type CartItem } from "@/types/products";
import { useProducts } from "@/hooks/useProducts";
import { createOrder } from "@/services/ordersService";
import { useAuth } from "@/contexts/AuthContext";
import { ProductGrid } from "@/components/pos/ProductGrid";
import { Cart } from "@/components/pos/Cart";
import { CheckoutModal } from "@/components/pos/CheckoutModal";
import { Skeleton } from "@/components/ui/skeleton";

const POSPage = () => {
  const { user } = useAuth();
  const { data: products = [], isLoading } = useProducts();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      <div className="flex-1 min-w-0">
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-foreground">Punto de Venta</h1>
          <p className="text-muted-foreground text-sm mt-1">Selecciona productos para agregar al pedido</p>
        </div>
        <ProductGrid
          products={filteredProducts}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onAddToCart={addToCart}
        />
      </div>
      <Cart
        items={cart}
        subtotal={subtotal}
        tax={tax}
        total={total}
        onUpdateQuantity={updateQuantity}
        onClear={clearCart}
        onCheckout={() => setCheckoutOpen(true)}
      />
      <CheckoutModal
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        total={total}
        onConfirm={async (paymentMethod, invoice) => {
          if (!user) return;
          await createOrder(
            user.id,
            cart,
            subtotal,
            tax,
            total,
            paymentMethod,
            invoice
          );
          clearCart();
          setCheckoutOpen(false);
        }}
      />
    </div>
  );
};

export default POSPage;
