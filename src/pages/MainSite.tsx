import { Routes, Route } from "react-router-dom";
import Index from "./Index";
import Auth from "./Auth";
import ClinicLanding from "./ClinicLanding";
import ClinicAuth from "./ClinicAuth";
import ClinicDashboard from "./ClinicDashboard";
import PricingPage from "./PricingPage";
import Dashboard from "./Dashboard";
import LabMarketplace from "./LabMarketplace";
import ReportView from "../components/ReportView";
import NotFound from "./NotFound";
import ProtectedRoute from "../components/ProtectedRoute";

/**
 * Routes for the main site (non-tenant specific)
 * These routes are only accessible when NOT on a tenant subdomain
 */
const MainSite = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/labs" element={<LabMarketplace />} />
      <Route path="/clinic" element={<ClinicLanding />} />
      <Route path="/pricing" element={<PricingPage />} />
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
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default MainSite;