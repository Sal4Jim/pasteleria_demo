import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import { OrderWithItems } from "@/types/orders";
import { fetchOrders } from "@/services/ordersService";

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
