import { useQuery } from "@tanstack/react-query";
import { fetchActiveProducts } from "@/services/productsService";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchActiveProducts,
  });
}
