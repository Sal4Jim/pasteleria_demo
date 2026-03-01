import { type CartItem } from "@/types/products";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

interface CartProps {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  onUpdateQuantity: (id: string, delta: number) => void;
  onClear: () => void;
  onCheckout: () => void;
}

export function Cart({ items, subtotal, tax, total, onUpdateQuantity, onClear, onCheckout }: CartProps) {
  return (
    <div className="w-full lg:w-80 xl:w-96 bg-card border border-border rounded-2xl flex flex-col shadow-sm">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-primary" />
          <h2 className="font-display font-bold text-lg">Pedido</h2>
        </div>
        {items.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear} className="text-destructive hover:text-destructive text-xs">
            <Trash2 className="h-3 w-3 mr-1" /> Limpiar
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-3 max-h-[400px]">
        {items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <ShoppingBag className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No hay productos en el pedido</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
              <span className="text-2xl">{item.emoji || "🍞"}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">S/ {item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6 rounded-full"
                  onClick={() => onUpdateQuantity(item.id, -1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6 rounded-full"
                  onClick={() => onUpdateQuantity(item.id, 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-border space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Subtotal</span>
          <span>S/ {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>IGV (18%)</span>
          <span>S/ {tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-foreground pt-2 border-t border-border">
          <span>Total</span>
          <span className="text-primary">S/ {total.toFixed(2)}</span>
        </div>
        <Button
          className="w-full mt-3 h-12 text-base font-semibold rounded-xl shadow-md"
          disabled={items.length === 0}
          onClick={onCheckout}
        >
          Cobrar
        </Button>
      </div>
    </div>
  );
}
