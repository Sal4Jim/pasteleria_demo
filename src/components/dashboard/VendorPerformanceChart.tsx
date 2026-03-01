import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { sampleOrders } from "@/data/bakeryData";

export function VendorPerformanceChart() {
  const vendorSales: Record<string, number> = {};
  sampleOrders.forEach((order) => {
    vendorSales[order.vendor] = (vendorSales[order.vendor] || 0) + order.total;
  });

  const data = Object.entries(vendorSales).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)),
  }));

  const colors = [
    "hsl(350, 60%, 65%)",
    "hsl(160, 35%, 65%)",
    "hsl(35, 80%, 65%)",
    "hsl(200, 50%, 65%)",
  ];

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-display">Rendimiento por Vendedor</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "0.75rem",
                border: "1px solid hsl(30, 20%, 88%)",
                fontSize: "13px",
              }}
              formatter={(value: number) => [`S/ ${value.toFixed(2)}`, "Ventas"]}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "12px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
