import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface OrderWithItems {
  id: string;
  vendor_id: string;
  vendor_name: string;
  total: number;
  subtotal: number;
  tax: number;
  payment_method: string;
  invoice: boolean;
  created_at: string;
  items: { product_name: string; quantity: number; unit_price: number; total_price: number }[];
}

async function fetchOrders(): Promise<OrderWithItems[]> {
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Fetch vendor profiles
  const vendorIds = [...new Set((orders || []).map((o) => o.vendor_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("user_id, full_name")
    .in("user_id", vendorIds);

  const profileMap: Record<string, string> = {};
  (profiles || []).forEach((p) => {
    profileMap[p.user_id] = p.full_name || "Sin nombre";
  });

  return (orders || []).map((o) => ({
    id: o.id,
    vendor_id: o.vendor_id,
    vendor_name: profileMap[o.vendor_id] || "Desconocido",
    total: Number(o.total),
    subtotal: Number(o.subtotal),
    tax: Number(o.tax),
    payment_method: o.payment_method,
    invoice: o.invoice,
    created_at: o.created_at,
    items: (o.order_items || []).map((i: any) => ({
      product_name: i.product_name,
      quantity: i.quantity,
      unit_price: Number(i.unit_price),
      total_price: Number(i.total_price),
    })),
  }));
}

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });
}

export function useTodayOrders() {
  const query = useOrders();
  const today = new Date().toISOString().split("T")[0];
  const todayOrders = (query.data || []).filter(
    (o) => o.created_at.split("T")[0] === today
  );
  return { ...query, data: todayOrders };
}
