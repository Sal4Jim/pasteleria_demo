import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import type { OrderWithItems } from "@/types/orders";

interface Props {
  orders: OrderWithItems[];
  isLoading: boolean;
}

export function SalesHoursChart({ orders, isLoading }: Props) {
  const hourlyData: Record<number, number> = {};
  orders.forEach((order) => {
    const hour = new Date(order.created_at).getHours();
    hourlyData[hour] = (hourlyData[hour] || 0) + order.total;
  });

  const data = Array.from({ length: 12 }, (_, i) => ({
    hour: `${(i + 8).toString().padStart(2, "0")}:00`,
    ventas: hourlyData[i + 8] || 0,
  }));

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-display">Horas Pico de Ventas</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[260px] w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data} margin={{ left: 0, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 20%, 90%)" />
              <XAxis dataKey="hour" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: "0.75rem", border: "1px solid hsl(30, 20%, 88%)", fontSize: "13px" }}
                formatter={(value: number) => [`S/ ${value.toFixed(2)}`, "Ventas"]}
              />
              <Line type="monotone" dataKey="ventas" stroke="hsl(350, 60%, 65%)" strokeWidth={2.5} dot={{ fill: "hsl(350, 60%, 65%)", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
