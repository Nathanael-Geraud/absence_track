import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import NotFound from "./pages/not-found";
import AuthPage from "./pages/auth-page";
import DashboardPage from "./pages/dashboard-page";
import AbsencesPage from "./pages/absences-page";
import StudentsPage from "./pages/students-page";
import ClassesPage from "./pages/classes-page";
import ReportsPage from "./pages/reports-page";
import SettingsPage from "./pages/settings-page";
import HelpPage from "./pages/help-page";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={DashboardPage} />
      <ProtectedRoute path="/absences" component={AbsencesPage} />
      <ProtectedRoute path="/students" component={StudentsPage} />
      <ProtectedRoute path="/classes" component={ClassesPage} />
      <ProtectedRoute path="/reports" component={ReportsPage} />
      <ProtectedRoute path="/settings" component={SettingsPage} />
      <ProtectedRoute path="/help" component={HelpPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
