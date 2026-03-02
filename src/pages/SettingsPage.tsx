import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, UserPlus, Trash2, Users, Edit2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface VendorInfo {
  user_id: string;
  full_name: string;
  email?: string;
}

const SettingsPage = () => {
  const [vendors, setVendors] = useState<VendorInfo[]>([]);
  
  // Creation state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [creating, setCreating] = useState(false);
  const [loadingVendors, setLoadingVendors] = useState(true);

  // Edit state
  const [selectedVendorForEdit, setSelectedVendorForEdit] = useState<VendorInfo | null>(null);
  const [editName, setEditName] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editing, setEditing] = useState(false);

  // Delete state
  const [selectedVendorForDelete, setSelectedVendorForDelete] = useState<VendorInfo | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleUpdateVendor = async () => {
    if (!selectedVendorForEdit || !editName) return;

    if (editPassword && editPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setEditing(true);
    const { data, error } = await supabase.functions.invoke("update-vendor", {
      body: { 
        user_id: selectedVendorForEdit.user_id, 
        full_name: editName,
        password: editPassword || undefined
      },
    });

    if (error || data?.error) {
      toast.error(data?.error || error?.message || "Error al actualizar vendedor");
    } else {
      toast.success("Vendedor actualizado exitosamente");
      setSelectedVendorForEdit(null);
      fetchVendors();
    }
    setEditing(false);
  };

  const handleDeleteVendor = async () => {
    if (!selectedVendorForDelete) return;

    setDeleting(true);
    const { data, error } = await supabase.functions.invoke("delete-vendor", {
      body: { user_id: selectedVendorForDelete.user_id },
    });

    if (error || data?.error) {
      toast.error(data?.error || error?.message || "Error al eliminar vendedor");
    } else {
      toast.success("Vendedor desactivado exitosamente (Soft Delete)");
      setSelectedVendorForDelete(null);
      fetchVendors();
    }
    setDeleting(false);
  };

  const openEditModal = (vendor: VendorInfo) => {
    setSelectedVendorForEdit(vendor);
    setEditName(vendor.full_name);
    setEditPassword("");
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
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map((v) => (
                  <TableRow key={v.user_id}>
                    <TableCell className="font-medium">{v.full_name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">Vendedor</Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditModal(v)}
                      >
                        <Edit2 className="h-4 w-4 text-primary" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedVendorForDelete(v)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Vendor Dialog */}
      <Dialog open={!!selectedVendorForEdit} onOpenChange={(open) => !open && setSelectedVendorForEdit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Vendedor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nombre completo</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Nueva contraseña (opcional)</Label>
              <Input
                type="password"
                placeholder="Dejar en blanco para no cambiar"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                minLength={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedVendorForEdit(null)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateVendor} disabled={editing}>
              {editing ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={!!selectedVendorForDelete} onOpenChange={(open) => !open && setSelectedVendorForDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Desactivar Vendedor?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción revocará su acceso al sistema y lo ocultará de la lista activa, pero 
              sus ventas previas se conservarán intactas para los reportes (Soft Delete).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Mantener</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={handleDeleteVendor}
              disabled={deleting}
            >
              {deleting ? "Eliminando..." : "Eliminar permanentemente"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SettingsPage;
