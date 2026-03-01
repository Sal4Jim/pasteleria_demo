import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { sampleOrders } from "@/data/bakeryData";

export function TopProductsChart() {
  const productCounts: Record<string, number> = {};
  sampleOrders.forEach((order) => {
    order.products.forEach((p) => {
      productCounts[p] = (productCounts[p] || 0) + 1;
    });
  });

  const data = Object.entries(productCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const colors = [
    "hsl(350, 60%, 65%)",
    "hsl(160, 35%, 65%)",
    "hsl(35, 80%, 65%)",
    "hsl(200, 50%, 65%)",
    "hsl(280, 40%, 70%)",
    "hsl(350, 40%, 75%)",
  ];

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-display">Productos Más Vendidos</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={130}
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "0.75rem",
                border: "1px solid hsl(30, 20%, 88%)",
                fontSize: "13px",
              }}
            />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={22}>
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
