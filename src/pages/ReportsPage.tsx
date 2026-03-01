import { sampleOrders } from "@/data/bakeryData";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";

const paymentBadge: Record<string, string> = {
  cash: "Efectivo",
  card: "Tarjeta",
  yape: "Yape",
};

const ReportsPage = () => {
  const exportCSV = () => {
    const header = "ID,Hora,Productos,Vendedor,Total,Método de Pago,Factura\n";
    const rows = sampleOrders
      .map(
        (o) =>
          `${o.id},${o.time},"${o.products.join(", ")}",${o.vendor},${o.total.toFixed(2)},${paymentBadge[o.paymentMethod]},${o.invoice ? "Sí" : "No"}`
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
          <p className="text-muted-foreground text-sm mt-1">Registro de ventas del día</p>
        </div>
        <Button onClick={exportCSV} className="gap-2">
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Hora</TableHead>
              <TableHead className="font-semibold">Productos</TableHead>
              <TableHead className="font-semibold">Vendedor</TableHead>
              <TableHead className="font-semibold text-right">Total</TableHead>
              <TableHead className="font-semibold">Pago</TableHead>
              <TableHead className="font-semibold">Factura</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleOrders.map((order) => (
              <TableRow key={order.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-mono text-sm">{order.id}</TableCell>
                <TableCell>{order.time}</TableCell>
                <TableCell className="max-w-[200px]">
                  <span className="text-sm">{order.products.join(", ")}</span>
                </TableCell>
                <TableCell>{order.vendor}</TableCell>
                <TableCell className="text-right font-semibold">S/ {order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {paymentBadge[order.paymentMethod]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {order.invoice && (
                    <FileText className="h-4 w-4 text-primary" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReportsPage;
