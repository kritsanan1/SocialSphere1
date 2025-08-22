import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { AuthGuard } from "@/components/auth/auth-guard";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import ConnectSocials from "@/pages/connect-socials";
import UploadPosts from "@/pages/upload-posts";
import ContentCalendar from "@/pages/content-calendar";
import SocialMessages from "@/pages/social-messages";
import SocialComments from "@/pages/social-comments";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      
      {/* Protected routes */}
      <Route path="/">
        <AuthGuard>
          <Dashboard />
        </AuthGuard>
      </Route>
      <Route path="/dashboard">
        <AuthGuard>
          <Dashboard />
        </AuthGuard>
      </Route>
      <Route path="/connect-socials">
        <AuthGuard>
          <ConnectSocials />
        </AuthGuard>
      </Route>
      <Route path="/upload-posts">
        <AuthGuard>
          <UploadPosts />
        </AuthGuard>
      </Route>
      <Route path="/content-calendar">
        <AuthGuard>
          <ContentCalendar />
        </AuthGuard>
      </Route>
      <Route path="/social-messages">
        <AuthGuard>
          <SocialMessages />
        </AuthGuard>
      </Route>
      <Route path="/social-comments">
        <AuthGuard>
          <SocialComments />
        </AuthGuard>
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
