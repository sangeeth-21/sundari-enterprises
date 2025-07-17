import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { PermissionGuard } from "@/components/PermissionGuard";

// Pages
import { Login } from "./pages/Login";
import { AdminLayout } from "./components/layout/AdminLayout";
import { Dashboard } from "./pages/admin/Dashboard";
import { Staff } from "./pages/admin/Staff";
import { Brands } from "./pages/admin/Brands";
import { Products } from "./pages/admin/Products";
import { Bills } from "./pages/admin/Bills";
import { Customers } from "./pages/admin/Customers";
import { CheckIn } from "./pages/admin/CheckIn";
import { Reports } from "./pages/admin/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component - moved inside providers
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

// Main App Routes Component
const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={
          <PermissionGuard permission="dashboard">
            <Dashboard />
          </PermissionGuard>
        } />
        <Route path="staff" element={<Staff />} />
        <Route path="brands" element={
          <PermissionGuard permission="brand">
            <Brands />
          </PermissionGuard>
        } />
        <Route path="products" element={
          <PermissionGuard permission="product">
            <Products />
          </PermissionGuard>
        } />
        <Route path="bills" element={
          <PermissionGuard permission="bills">
            <Bills />
          </PermissionGuard>
        } />
        <Route path="customers" element={
          <PermissionGuard permission="customer">
            <Customers />
          </PermissionGuard>
        } />
        <Route path="checkin" element={
          <PermissionGuard permission="checkin">
            <CheckIn />
          </PermissionGuard>
        } />
        <Route path="reports" element={
          <PermissionGuard permission="reports">
            <Reports />
          </PermissionGuard>
        } />
      </Route>
      
      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
