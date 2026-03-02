import { type Product } from "@/types/products";
import { type Category } from "@/types/categories";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onAddToCart: (product: Product) => void;
}

export function ProductGrid({ products, categories, selectedCategory, onCategoryChange, onAddToCart }: ProductGridProps) {
  return (
    <div>
      <div className="flex gap-2 mb-5 flex-wrap">
        <Button
          variant={selectedCategory === "all" ? "default" : "secondary"}
          size="sm"
          onClick={() => onCategoryChange("all")}
          className={cn(
            "rounded-full text-xs font-medium transition-all",
            selectedCategory === "all" && "shadow-md"
          )}
        >
          Todos
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.slug}
            variant={selectedCategory === cat.slug ? "default" : "secondary"}
            size="sm"
            onClick={() => onCategoryChange(cat.slug)}
            className={cn(
              "rounded-full text-xs font-medium transition-all",
              selectedCategory === cat.slug && "shadow-md"
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
            disabled={product.stock <= 0}
            className={cn(
              "group flex flex-col items-center p-4 rounded-xl bg-card border border-border transition-all duration-200 text-left relative overflow-hidden",
              product.stock > 0 
                ? "hover:border-primary/30 hover:shadow-lg cursor-pointer" 
                : "opacity-60 cursor-not-allowed grayscale"
            )}
          >
            {product.stock <= 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[1px] z-10">
                <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-md rotate-[-15deg]">
                  AGOTADO
                </span>
              </div>
            )}
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">
              {product.emoji || "🍞"}
            </div>
            <span className="text-sm font-medium text-card-foreground text-center leading-tight">
              {product.name}
            </span>
            <span className="text-primary font-bold text-sm mt-1">
              S/ {product.price.toFixed(2)}
            </span>
            <span className="text-xs text-muted-foreground font-medium mt-1">
              Stock: {product.stock}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
