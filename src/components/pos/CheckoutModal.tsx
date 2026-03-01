import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CreditCard, Banknote, Smartphone, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const paymentMethods = [
  { id: "cash", label: "Efectivo", icon: Banknote },
  { id: "card", label: "Tarjeta", icon: CreditCard },
  { id: "yape", label: "Yape", icon: Smartphone },
] as const;

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  total: number;
  onConfirm: () => void;
}

export function CheckoutModal({ open, onOpenChange, total, onConfirm }: CheckoutModalProps) {
  const [method, setMethod] = useState<string>("cash");
  const [invoice, setInvoice] = useState(false);

  const handleConfirm = () => {
    toast.success("¡Venta registrada exitosamente!", {
      description: `Total: S/ ${total.toFixed(2)} — ${paymentMethods.find((m) => m.id === method)?.label}${invoice ? " (con factura)" : ""}`,
      icon: <CheckCircle2 className="h-5 w-5" />,
    });
    onConfirm();
    setMethod("cash");
    setInvoice(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Finalizar Venta</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total a cobrar</p>
            <p className="text-4xl font-bold text-primary mt-1">S/ {total.toFixed(2)}</p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Método de pago</Label>
            <div className="grid grid-cols-3 gap-3">
              {paymentMethods.map((pm) => (
                <button
                  key={pm.id}
                  onClick={() => setMethod(pm.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                    method === pm.id
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <pm.icon className="h-6 w-6" />
                  <span className="text-xs font-medium">{pm.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
            <div>
              <Label htmlFor="invoice" className="text-sm font-medium">
                Factura electrónica
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">Comprobante SUNAT</p>
            </div>
            <Switch id="invoice" checked={invoice} onCheckedChange={setInvoice} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} className="min-w-[120px]">
            Confirmar Venta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
