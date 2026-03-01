import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/products";

export async function fetchActiveProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("name");

  if (error) {
    console.error("Error fetching products:", error);
    throw error;
  }

  // Map database fields to the Product interface
  return (data || []).map((p) => ({
    id: p.id,
    name: p.name,
    price: Number(p.price),
    category: p.category,
    emoji: p.emoji,
    active: p.active,
    created_at: p.created_at,
  }));
}
