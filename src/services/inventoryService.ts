import { supabase } from "@/integrations/supabase/client";

export interface InventoryMovementInsert {
  product_id: string;
  user_id: string;
  quantity: number;
  type?: "production" | "adjustment";
  notes?: string;
}

export async function createInventoryMovement(data: InventoryMovementInsert) {
  const { error } = await supabase
    .from("inventory_movements")
    .insert([
      {
        product_id: data.product_id,
        user_id: data.user_id,
        quantity: data.quantity,
        type: data.type || "production",
        notes: data.notes || "Ingreso desde Punto de Venta",
      }
    ]);

  if (error) {
    console.error("Error creating inventory movement:", error);
    throw error;
  }
}
