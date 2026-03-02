import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/products";

type ProductRow = {
  id: string;
  name: string;
  price: number | string;
  category: string;
  emoji: string;
  active: boolean;
  stock: number | string;
  created_at: string;
};

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
  const rows = data as unknown as ProductRow[];
  return rows.map((p) => ({
    id: p.id,
    name: p.name,
    price: Number(p.price),
    category: p.category,
    emoji: p.emoji,
    active: p.active,
    stock: Number(p.stock) || 0,
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

  const rows = data as unknown as ProductRow[];
  return rows.map((p) => ({
    id: p.id,
    name: p.name,
    price: Number(p.price),
    category: p.category,
    emoji: p.emoji,
    active: p.active,
    stock: Number(p.stock) || 0,
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
      active: product.active,
      stock: product.stock
    }])
    .select()
    .single();

  if (error) {
    console.error("Error creating product:", error);
    throw error;
  }

  const row = data as unknown as ProductRow;
  return {
    ...row,
    price: Number(row.price),
    stock: Number(row.stock) || 0
  } as Product;
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

  const row = data as unknown as ProductRow;
  return {
    ...row,
    price: Number(row.price),
    stock: Number(row.stock) || 0
  } as Product;
}
