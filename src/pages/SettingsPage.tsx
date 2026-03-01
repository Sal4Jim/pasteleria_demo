import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, UserPlus, Trash2, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface VendorInfo {
  user_id: string;
  full_name: string;
  email?: string;
}

const SettingsPage = () => {
  const [vendors, setVendors] = useState<VendorInfo[]>([]);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [creating, setCreating] = useState(false);
  const [loadingVendors, setLoadingVendors] = useState(true);

  const fetchVendors = async () => {
    setLoadingVendors(true);
    const { data: roles } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "vendor");

    if (roles && roles.length > 0) {
      const userIds = roles.map((r) => r.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", userIds);

      setVendors(
        (profiles || []).map((p) => ({
          user_id: p.user_id,
          full_name: p.full_name,
        }))
      );
    } else {
      setVendors([]);
    }
    setLoadingVendors(false);
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleCreateVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail || !newPassword) {
      toast.error("Todos los campos son requeridos");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setCreating(true);
    const { data, error } = await supabase.functions.invoke("create-vendor", {
      body: { email: newEmail, password: newPassword, full_name: newName },
    });

    if (error || data?.error) {
      toast.error(data?.error || error?.message || "Error al crear vendedor");
    } else {
      toast.success(`Vendedor "${newName}" creado exitosamente`);
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      fetchVendors();
    }
    setCreating(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Configuración</h1>
        <p className="text-muted-foreground text-sm mt-1">Administra vendedores y tu negocio</p>
      </div>

      {/* Create vendor form */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <UserPlus className="h-5 w-5 text-muted-foreground" />
            Crear Nuevo Vendedor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateVendor} className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="vendor-name">Nombre completo</Label>
              <Input
                id="vendor-name"
                placeholder="María García"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vendor-email">Correo electrónico</Label>
              <Input
                id="vendor-email"
                type="email"
                placeholder="maria@dulcehogar.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vendor-password">Contraseña</Label>
              <Input
                id="vendor-password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="sm:col-span-3">
              <Button type="submit" disabled={creating} className="gap-2">
                <UserPlus className="h-4 w-4" />
                {creating ? "Creando..." : "Crear Vendedor"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Vendors list */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-5 w-5 text-muted-foreground" />
            Vendedores Registrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingVendors ? (
            <p className="text-muted-foreground text-sm">Cargando...</p>
          ) : vendors.length === 0 ? (
            <p className="text-muted-foreground text-sm">No hay vendedores registrados aún.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Rol</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map((v) => (
                  <TableRow key={v.user_id}>
                    <TableCell className="font-medium">{v.full_name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">Vendedor</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
