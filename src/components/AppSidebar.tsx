import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { useRole } from "@/context/RoleContext";
import { ShoppingCart, LayoutDashboard, FileText, Settings, Cake, UserCog } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const adminItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Punto de Venta", url: "/pos", icon: ShoppingCart },
  { title: "Reportes", url: "/reports", icon: FileText },
  { title: "Configuración", url: "/settings", icon: Settings },
];

const vendorItems = [
  { title: "Punto de Venta", url: "/pos", icon: ShoppingCart },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { role, setRole } = useRole();
  const items = role === "admin" ? adminItems : vendorItems;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground text-lg">
            <Cake className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-display text-lg font-bold leading-tight text-sidebar-foreground">
                Dulce Hogar
              </h2>
              <p className="text-xs text-muted-foreground">Bakery & Café</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground">
            Menú
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-sidebar-accent/60 transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && (
          <div className="flex items-center gap-2 rounded-lg bg-sidebar-accent/50 p-3">
            <UserCog className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="role-switch" className="text-xs text-muted-foreground flex-1">
              {role === "admin" ? "Admin" : "Vendedor"}
            </Label>
            <Switch
              id="role-switch"
              checked={role === "admin"}
              onCheckedChange={(checked) => setRole(checked ? "admin" : "vendor")}
              className="scale-75"
            />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
