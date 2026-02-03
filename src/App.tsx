import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./modules/auth/login/Login";
import ProfilePage from "./pages/ProfilePage";
import ResetPassword from './pages/ResetPassword';
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import OAuthCallback from "./pages/OAuthCallback";
import OAuthComplete from "./pages/OAuthComplete";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";

// Lazy load Dashboard components to prevent top-level errors from breaking the app
const DashboardList = lazy(() => import("./modules/dashboard/list/DashboardList"));
const DashboardBuilder = lazy(() => import("./modules/dashboard/editor/DashboardEditor"));
const DashboardViewer = lazy(() => import("./modules/dashboard/viewer/DashboardViewer"));

const Dashboard = lazy(() => import("./pages/Dashboard"));
const DynamicFormList = lazy(() => import("./modules/dynamicform/DynamicFormList"));
const DynamicFormViewer = lazy(() => import("./modules/dynamicform/DynamicFormViewer"));
const ChartShowcase = lazy(() => import("./pages/ChartShowcase"));
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Main Dashboard Route */}
            {/* Protected Routes Wrapper */}
            <Route element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              {/* Main Dashboard Route */}
              <Route path="/home" element={<Dashboard />} />

              {/* Dashboard Builder Routes */}
              <Route path="/dashboards" element={<DashboardList />} />
              <Route path="/dashboards/new" element={<DashboardBuilder />} />
              <Route path="/dashboards/:id" element={<DashboardViewer />} />
              <Route path="/dashboards/edit/:id" element={<DashboardBuilder />} />

              {/* Dynamic Forms */}
              <Route path="/dynamic-forms" element={<DynamicFormList />} />
              <Route path="/dynamic-forms/:id" element={<DynamicFormViewer />} />

              {/* Chart Library Showcase */}
              <Route path="/charts" element={<ChartShowcase />} />

              {/* User Management */}
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Auth Redirects */}
            <Route path="/" element={<Navigate to='/login' replace />} />
            <Route path="/auth/callback" element={<OAuthCallback />} />
            <Route path="/oauth-complete" element={<OAuthComplete />} />

            {/* Legal */}
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;