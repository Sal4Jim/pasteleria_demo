import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sampleOrders } from "@/data/bakeryData";
import { DollarSign, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { TopProductsChart } from "@/components/dashboard/TopProductsChart";
import { SalesHoursChart } from "@/components/dashboard/SalesHoursChart";
import { VendorPerformanceChart } from "@/components/dashboard/VendorPerformanceChart";

const DashboardPage = () => {
  const totalSales = sampleOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = sampleOrders.length;
  const avgOrder = totalSales / totalOrders;
  const uniqueVendors = new Set(sampleOrders.map((o) => o.vendor)).size;

  const metrics = [
    { title: "Ventas del Día", value: `S/ ${totalSales.toFixed(2)}`, icon: DollarSign, color: "text-primary" },
    { title: "Pedidos", value: totalOrders.toString(), icon: ShoppingCart, color: "text-accent" },
    { title: "Ticket Promedio", value: `S/ ${avgOrder.toFixed(2)}`, icon: TrendingUp, color: "text-warning" },
    { title: "Vendedores Activos", value: uniqueVendors.toString(), icon: Users, color: "text-success" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Resumen del día — Dulce Hogar</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.title} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{m.title}</CardTitle>
              <m.icon className={`h-5 w-5 ${m.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{m.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProductsChart />
        <SalesHoursChart />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VendorPerformanceChart />
      </div>
    </div>
  );
};

export default DashboardPage;
