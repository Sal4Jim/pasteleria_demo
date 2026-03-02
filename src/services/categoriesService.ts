import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/types/categories";

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }

  return data as Category[];
}

export async function createCategory(slug: string, label: string): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .insert([{ slug, label }])
    .select()
    .single();

  if (error) {
    console.error("Error creating category:", error);
    throw error;
  }

  return data as Category;
}
