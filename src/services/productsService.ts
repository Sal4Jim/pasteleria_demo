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

export async function fetchAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching all products:", error);
    throw error;
  }

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

export async function createProduct(product: Omit<Product, "id" | "created_at">): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .insert([{
      name: product.name,
      price: product.price,
      category: product.category,
      emoji: product.emoji,
      active: product.active
    }])
    .select()
    .single();

  if (error) {
    console.error("Error creating product:", error);
    throw error;
  }

  return {
    ...data,
    price: Number(data.price)
  };
}

export async function updateProduct(id: string, updates: Partial<Omit<Product, "id" | "created_at">>): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating product:", error);
    throw error;
  }

  return {
    ...data,
    price: Number(data.price)
  };
}
