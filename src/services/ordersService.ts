import { supabase } from "@/integrations/supabase/client";
import { OrderWithItems, OrderInsert, OrderItemInsert } from "@/types/orders";
import { CartItem } from "@/types/products";

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

export async function createOrder(
  vendorId: string,
  cart: CartItem[],
  subtotal: number,
  tax: number,
  total: number,
  paymentMethod: string,
  invoice: boolean
) {
  // 1. Insert order
  const orderData: OrderInsert = {
    vendor_id: vendorId,
    subtotal,
    tax,
    total,
    payment_method: paymentMethod,
    invoice,
  };

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert(orderData)
    .select()
    .single();

  if (orderError) {
    console.error("Error creating order:", orderError);
    throw orderError;
  }

  if (!order) {
    throw new Error("Order was not created");
  }

  // 2. Insert items
  const itemsData: OrderItemInsert[] = cart.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    product_name: item.name,
    quantity: item.quantity,
    unit_price: item.price,
    total_price: item.price * item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(itemsData);

  if (itemsError) {
    console.error("Error creating order items:", itemsError);
    throw itemsError;
  }

  return order;
}
