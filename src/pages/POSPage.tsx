import React, { useState, useCallback } from "react";
import { toast } from "sonner";
import { type Product, type CartItem } from "@/types/products";
import { useProducts } from "@/hooks/useProducts";
import { fetchCategories } from "@/services/categoriesService";
import { useQuery } from "@tanstack/react-query";
import { createOrder } from "@/services/ordersService";
import { useAuth } from "@/contexts/AuthContext";
import { ProductGrid } from "@/components/pos/ProductGrid";
import { Cart } from "@/components/pos/Cart";
import { CheckoutModal } from "@/components/pos/CheckoutModal";
import { RestockModal } from "@/components/pos/RestockModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PackagePlus } from "lucide-react";

const POSPage = () => {
  const { user } = useAuth();
  const { data: products = [], isLoading, refetch } = useProducts();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [restockOpen, setRestockOpen] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const addToCart = useCallback((product: Product) => {
    if (product.stock < 1) {
      toast.error("Producto agotado");
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          toast.error(`Solo hay ${product.stock} unidades de ${product.name} disponibles.`);
          return prev;
        }
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const updateQuantity = useCallback((id: string, delta: number) => {
    setCart((prev) => {
      const item = prev.find(i => i.id === id);
      if (!item) return prev;
      
      const newQuantity = item.quantity + delta;
      
      if (delta > 0 && newQuantity > item.stock) {
        toast.error(`Solo hay ${item.stock} unidades disponibles.`);
        return prev;
      }
      
      return prev
        .map((i) =>
          i.id === id ? { ...i, quantity: newQuantity } : i
        )
        .filter((i) => i.quantity > 0);
    });
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const { total, subtotal, tax } = React.useMemo(() => {
    const t = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const s = t / 1.18;
    return { total: t, subtotal: s, tax: t - s };
  }, [cart]);

  const filteredProducts = React.useMemo(
    () =>
      selectedCategory === "all"
        ? products
        : products.filter((p) => p.category === selectedCategory),
    [selectedCategory, products]
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      <div className="flex-1 min-w-0">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Punto de Venta</h1>
            <p className="text-muted-foreground text-sm mt-1">Selecciona productos para agregar al pedido</p>
          </div>
          <Button variant="outline" onClick={() => setRestockOpen(true)} className="w-full sm:w-auto">
            <PackagePlus className="mr-2 h-4 w-4" /> Ingresar Lote
          </Button>
        </div>
        <ProductGrid
          products={filteredProducts}
          categories={categories}
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
          await refetch();
        }}
      />
      <RestockModal 
        open={restockOpen}
        onOpenChange={setRestockOpen}
        products={products}
        userId={user?.id || ""}
      />
    </div>
  );
};

export default POSPage;
