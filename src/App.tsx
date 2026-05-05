import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useAppState } from "@/contexts/AppContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import PolicyBriefs from "./pages/PolicyBriefs";
import FeedbackExplorer from "./pages/FeedbackExplorer";
import SubmitFeedback from "./pages/SubmitFeedback";
import Analytics from "./pages/Analytics";
import AdminInsights from "./pages/AdminInsights";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function RootRoute() {
  const { userRole } = useAppState();
  if (userRole === "Citizen") {
    return <Navigate to="/submit" replace />;
  }
  return <Dashboard />;
}

function ProtectedShell() {
  return (
    <AppLayout>
      <AppRoutes />
    </AppLayout>
  );
}

function AdminOnly({ children }: { children: JSX.Element }) {
  const { userRole } = useAppState();
  if (userRole !== "Admin") {
    return <Navigate to="/submit" replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRoute />} />
      <Route path="/submit" element={<SubmitFeedback />} />
      <Route path="/briefs" element={<AdminOnly><PolicyBriefs /></AdminOnly>} />
      <Route path="/explorer" element={<AdminOnly><FeedbackExplorer /></AdminOnly>} />
      <Route path="/analytics" element={<AdminOnly><Analytics /></AdminOnly>} />
      <Route path="/admin-insights" element={<AdminOnly><AdminInsights /></AdminOnly>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function AuthRouter() {
  const { isAuthenticated } = useAppState();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="*" element={<ProtectedShell />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <AuthRouter />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
