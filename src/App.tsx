import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import ContractProcessing from "./pages/ContractProcessing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { ContractManagement } from "./pages/ContractManagement";
import { UserManagement } from "./pages/UserManagement";
import { Settings } from "./pages/Settings";
import { Reports } from "./pages/Reports";

const queryClient = new QueryClient();

// Componente para redirecionar baseado na autenticação
const HomeRedirect = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  console.log('HomeRedirect - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            {/* Rota principal - redireciona para login ou dashboard */}
            <Route path="/" element={<HomeRedirect />} />
            
            {/* Rota de login */}
            <Route path="/login" element={<Login />} />
            
            {/* Rota pública para geração de contratos */}
            <Route path="/contract" element={<Index />} />
            <Route path="/processing" element={<ContractProcessing />} />
            
            {/* Rotas protegidas */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Rotas de gerenciamento (admin) */}
            <Route 
              path="/contracts" 
              element={
                <ProtectedRoute requireAdmin>
                  <ContractManagement />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/users" 
              element={
                <ProtectedRoute requireAdmin>
                  <UserManagement />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute requireAdmin>
                  <Reports />
                </ProtectedRoute>
              } 
            />
            
            {/* Rota de admin (opcional) */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
