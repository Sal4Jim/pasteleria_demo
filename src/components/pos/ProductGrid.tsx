import { type Product } from "@/data/bakeryData";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", label: "Todos" },
  { id: "cakes", label: "Tortas" },
  { id: "cupcakes", label: "Cupcakes" },
  { id: "beverages", label: "Bebidas" },
  { id: "custom", label: "Personalizado" },
];

interface ProductGridProps {
  products: Product[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onAddToCart: (product: Product) => void;
}

export function ProductGrid({ products, selectedCategory, onCategoryChange, onAddToCart }: ProductGridProps) {
  return (
    <div>
      <div className="flex gap-2 mb-5 flex-wrap">
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? "default" : "secondary"}
            size="sm"
            onClick={() => onCategoryChange(cat.id)}
            className={cn(
              "rounded-full text-xs font-medium transition-all",
              selectedCategory === cat.id && "shadow-md"
            )}
          >
            {cat.label}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => onAddToCart(product)}
            className="group flex flex-col items-center p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-200 cursor-pointer text-left"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">
              {product.image}
            </div>
            <span className="text-sm font-medium text-card-foreground text-center leading-tight">
              {product.name}
            </span>
            <span className="text-primary font-bold text-sm mt-1">
              S/ {product.price.toFixed(2)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
