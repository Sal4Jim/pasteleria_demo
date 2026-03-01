import { supabase } from "@/integrations/supabase/client";
import { OrderWithItems } from "@/types/orders";

export async function fetchOrders(): Promise<OrderWithItems[]> {
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
