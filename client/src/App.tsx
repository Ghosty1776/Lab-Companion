import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout";
import LoginPage from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import DevicesPage from "@/pages/devices";
import NotesPage from "@/pages/notes";
import ChecklistsPage from "@/pages/checklists";
import SettingsPage from "@/pages/settings";
import { useStore } from "@/lib/store";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const user = useStore(state => state.user);
  
  if (!user) {
    return <Redirect to="/login" />;
  }
  
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      
      <Route path="/">
        <Layout>
          <ProtectedRoute component={Dashboard} />
        </Layout>
      </Route>
      
      <Route path="/devices">
        <Layout>
          <ProtectedRoute component={DevicesPage} />
        </Layout>
      </Route>
      
      <Route path="/notes">
        <Layout>
          <ProtectedRoute component={NotesPage} />
        </Layout>
      </Route>
      
      <Route path="/checklists">
        <Layout>
          <ProtectedRoute component={ChecklistsPage} />
        </Layout>
      </Route>
      
      <Route path="/settings">
        <Layout>
          <ProtectedRoute component={SettingsPage} />
        </Layout>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;