import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RoleProvider, useRole } from "@/context/RoleContext";
import { AppLayout } from "@/components/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import POSPage from "./pages/POSPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { role } = useRole();

  return (
    <AppLayout>
      <Routes>
        <Route
          path="/"
          element={role === "admin" ? <DashboardPage /> : <Navigate to="/pos" replace />}
        />
        <Route path="/pos" element={<POSPage />} />
        <Route
          path="/reports"
          element={role === "admin" ? <ReportsPage /> : <Navigate to="/pos" replace />}
        />
        <Route
          path="/settings"
          element={role === "admin" ? <SettingsPage /> : <Navigate to="/pos" replace />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RoleProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </RoleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
