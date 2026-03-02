import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAllProducts, createProduct, updateProduct } from "@/services/productsService";
import { Product } from "@/types/products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { PackagePlus, PackageSearch, TrendingUp, Edit2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchOrders } from "@/services/ordersService";

const categories = [
  { id: "cakes", label: "Tortas" },
  { id: "cupcakes", label: "Cupcakes" },
  { id: "beverages", label: "Bebidas" },
  { id: "custom", label: "Personalizado" },
];

export default function ProductsAdminPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("cakes");
  const [emoji, setEmoji] = useState("🎂");

  // Edit stock state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editStockValue, setEditStockValue] = useState("");

  // Fetch all products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: fetchAllProducts,
  });

  // Fetch orders to calculate Top Products
  const { data: orders = [] } = useQuery({
    queryKey: ["orders-for-top"],
    queryFn: fetchOrders,
  });

  // Calculate Top Products
  const topProducts = React.useMemo(() => {
    const counts: Record<string, { name: string; qty: number; total: number }> = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (!counts[item.product_name]) {
          counts[item.product_name] = { name: item.product_name, qty: 0, total: 0 };
        }
        counts[item.product_name].qty += item.quantity;
        counts[item.product_name].total += item.total_price;
      });
    });
    return Object.values(counts)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5); // Top 5
  }, [orders]);

  const createMutation = useMutation({
    mutationFn: (newProduct: Omit<Product, "id" | "created_at">) => createProduct(newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] }); // Invalidar query del POS
      toast.success("Producto creado exitosamente");
      setName("");
      setPrice("");
      setStock("");
      setCategory("cakes");
      setEmoji("🎂");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Error al crear producto");
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => updateProduct(id, { active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Estado actualizado");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Error al actualizar estado");
    },
  });

  const updateStockMutation = useMutation({
    mutationFn: ({ id, stock }: { id: string; stock: number }) => updateProduct(id, { stock }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Stock actualizado exitosamente");
      setSelectedProduct(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Error al actualizar stock");
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !category) {
      toast.error("Complete los campos obligatorios");
      return;
    }
    createMutation.mutate({
      name,
      price: Number(price),
      stock: Number(stock) || 0,
      category,
      emoji: emoji || "📦",
      active: true,
    });
  };

  const handleUpdateStock = () => {
    if (!selectedProduct || !editStockValue || isNaN(Number(editStockValue))) return;
    updateStockMutation.mutate({
      id: selectedProduct.id,
      stock: Number(editStockValue),
    });
  };

  const filteredProducts = React.useMemo(() => 
    products.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [products, searchTerm]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Gestión de Productos</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Inventario, top de ventas y creación de nuevos productos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TOP PRODUCTS */}
        <Card className="lg:col-span-1 border-border/50 shadow-sm h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-5 w-5 text-primary" />
              Top 5 Más Vendidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay ventas registradas aún.</p>
            ) : (
              <ul className="space-y-3">
                {topProducts.map((p, idx) => (
                  <li key={p.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-muted-foreground w-4">{idx + 1}.</span>
                      <span className="font-medium">{p.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground block">{p.qty} unid.</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* CREATE PRODUCT FORM */}
        <Card className="lg:col-span-2 border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PackagePlus className="h-5 w-5 text-muted-foreground" />
              Agregar Nuevo Producto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2 lg:col-span-2">
                <Label>Nombre</Label>
                <Input
                  placeholder="Ej: Torta Tres Leches"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Precio (S/)</Label>
                <Input
                  type="number"
                  step="0.10"
                  placeholder="15.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Stock Inicial</Label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Categoría</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Emoji</Label>
                <Input
                  placeholder="🎂"
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-3 flex items-end">
                <Button type="submit" disabled={createMutation.isPending} className="w-full sm:w-auto">
                  {createMutation.isPending ? "Agregando..." : "Registrar Producto"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* FILTER AND TABLE */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <PackageSearch className="h-5 w-5 text-muted-foreground" />
            Catálogo Completo
          </CardTitle>
          <Input
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sm:w-[300px]"
          />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron productos.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Icon</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead className="text-right">Precio</TableHead>
                    <TableHead className="text-center">Stock</TableHead>
                    <TableHead className="text-center">Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="text-xl text-center">{product.emoji || "🍞"}</TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="capitalize text-muted-foreground">
                        {categories.find((c) => c.id === product.category)?.label || product.category}
                      </TableCell>
                      <TableCell className="text-right">S/ {product.price.toFixed(2)}</TableCell>
                      <TableCell className="text-center">
                        <span className={product.stock <= 0 ? "text-destructive font-bold" : "font-medium"}>
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={product.active}
                          onCheckedChange={(checked) =>
                            toggleStatusMutation.mutate({ id: product.id, active: checked })
                          }
                          disabled={toggleStatusMutation.isPending}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedProduct(product);
                            setEditStockValue(product.stock.toString());
                          }}
                        >
                          <Edit2 className="h-4 w-4 text-primary" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* EDIT STOCK DIALOG */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajustar Stock: {selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nuevo Stock total</Label>
              <Input
                type="number"
                min="0"
                value={editStockValue}
                onChange={(e) => setEditStockValue(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Ingresa la cantidad real que hay actualmente en el almacén o tienda para este producto.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedProduct(null)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateStock} disabled={updateStockMutation.isPending}>
              {updateStockMutation.isPending ? "Guardando..." : "Guardar stock"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
