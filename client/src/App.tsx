import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Home from "@/pages/home";
import Landing from "@/pages/landing";
import Wallet from "@/pages/wallet";
import Draws from "@/pages/draws-enhanced";
import History from "@/pages/history";
import Profile from "@/pages/profile";
import Result from "@/pages/result";
import Reels from "@/pages/reels";
import Earn from "@/pages/earn";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/wallet" component={Wallet} />
          <Route path="/draws" component={Draws} />
          <Route path="/history" component={History} />
          <Route path="/profile" component={Profile} />
          <Route path="/results" component={Result} />
          <Route path="/reels" component={Reels} />
          <Route path="/earn" component={Earn} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark min-h-screen">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
