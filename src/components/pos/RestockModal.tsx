import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createInventoryMovement } from "@/services/inventoryService";
import { Product } from "@/types/products";
import { toast } from "sonner";

interface RestockModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: Product[];
  userId: string;
}

export function RestockModal({ open, onOpenChange, products, userId }: RestockModalProps) {
  const queryClient = useQueryClient();
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");

  const movementMutation = useMutation({
    mutationFn: async () => {
      if (!selectedProductId || !quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
        throw new Error("Agrega una cantidad válida");
      }
      await createInventoryMovement({
        product_id: selectedProductId,
        user_id: userId,
        quantity: Number(quantity),
        notes: notes || "Ingreso desde mostrador (Lote/Cocina)",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Stock ingresado correctamente");
      setQuantity("");
      setNotes("");
      setSelectedProductId("");
      onOpenChange(false);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Error al agregar stock");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ingresar Lote / Producción</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Producto Recibido</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
            >
              <option value="" disabled>Seleccione producto...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.emoji} {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Cantidad que llegó</Label>
            <Input
              type="number"
              min="1"
              placeholder="Ej: 5"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Notas (Opcional)</Label>
            <Input
              placeholder="Ej: Bandeja de la tarde"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={() => movementMutation.mutate()} 
            disabled={movementMutation.isPending}
          >
            {movementMutation.isPending ? "Registrando..." : "Registrar Ingreso"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
