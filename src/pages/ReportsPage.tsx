import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { useOrders } from "@/hooks/useOrders";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const paymentBadge: Record<string, string> = {
  cash: "Efectivo",
  card: "Tarjeta",
  yape: "Yape",
};

const ReportsPage = () => {
  const { data: orders = [], isLoading } = useOrders();

  const exportCSV = () => {
    const header = "ID,Fecha,Productos,Vendedor,Total,Método de Pago,Factura\n";
    const rows = orders
      .map(
        (o) =>
          `${o.id.slice(0, 8)},${format(new Date(o.created_at), "dd/MM/yyyy HH:mm")},"${o.items.map((i) => `${i.product_name} x${i.quantity}`).join(", ")}",${o.vendor_name},${o.total.toFixed(2)},${paymentBadge[o.payment_method] || o.payment_method},${o.invoice ? "Sí" : "No"}`
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ventas_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Reporte exportado exitosamente");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Reportes</h1>
          <p className="text-muted-foreground text-sm mt-1">Historial de ventas</p>
        </div>
        <Button onClick={exportCSV} className="gap-2" disabled={orders.length === 0}>
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Fecha</TableHead>
              <TableHead className="font-semibold">Productos</TableHead>
              <TableHead className="font-semibold">Vendedor</TableHead>
              <TableHead className="font-semibold text-right">Total</TableHead>
              <TableHead className="font-semibold">Pago</TableHead>
              <TableHead className="font-semibold">Factura</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                  No hay ventas registradas aún
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono text-sm">{order.id.slice(0, 8)}</TableCell>
                  <TableCell>{format(new Date(order.created_at), "dd/MM/yyyy HH:mm")}</TableCell>
                  <TableCell className="max-w-[200px]">
                    <span className="text-sm">
                      {order.items.map((i) => `${i.product_name} x${i.quantity}`).join(", ")}
                    </span>
                  </TableCell>
                  <TableCell>{order.vendor_name}</TableCell>
                  <TableCell className="text-right font-semibold">S/ {order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {paymentBadge[order.payment_method] || order.payment_method}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {order.invoice && <FileText className="h-4 w-4 text-primary" />}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReportsPage;
