import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Configuración</h1>
        <p className="text-muted-foreground text-sm mt-1">Administra tu negocio</p>
      </div>
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <SettingsIcon className="h-5 w-5 text-muted-foreground" />
            Configuración General
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Las opciones de configuración estarán disponibles próximamente. Aquí podrás gestionar productos, vendedores, impuestos y más.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
