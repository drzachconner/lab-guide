import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ClinicLanding from "./pages/ClinicLanding";
import ClinicAuth from "./pages/ClinicAuth";
import ClinicDashboard from "./pages/ClinicDashboard";
import TenantPortal from "./pages/TenantPortal";
import Dashboard from "./components/Dashboard";
import ReportView from "./components/ReportView";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/clinic" element={<ClinicLanding />} />
            <Route path="/clinic-signup" element={<ClinicAuth />} />
            <Route path="/clinic-login" element={<ClinicAuth />} />
            <Route path="/clinic-dashboard" element={
              <ProtectedRoute>
                <ClinicDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/report/:id" element={
              <ProtectedRoute>
                <ReportView />
              </ProtectedRoute>
            } />
            {/* Tenant-specific routes - must be at the end before catch-all */}
            <Route path="/:slug" element={<TenantPortal />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
