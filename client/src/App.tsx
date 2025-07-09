import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { ParticleBackground } from "@/components/layout/particle-background";
import { Navbar } from "@/components/layout/navbar";
import { useTheme } from "@/hooks/use-theme";
import Home from "@/pages/home";
import Applications from "@/pages/applications";
import Oyunlar from "@/pages/0yunlar";
import Admin from "@/pages/admin";
import AdminLogin from "@/pages/admin-login";
import NotFound from "@/pages/not-found";
import Chat from "@/pages/chat";
import MouseTrail from "@/components/layout/mouse-trail";
import { AnimatePresence } from 'framer-motion';

function Router() {
  const [location] = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Switch key={location}>
        <Route path="/" component={Home} />
        <Route path="/applications" component={Applications} />
        <Route path="/0yunlar" component={Oyunlar} />
        <Route path="/admin-login" component={AdminLogin} />
        <Route path="/admin" component={Admin} />
        <Route path="/chat" component={Chat} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  const { isDark } = useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className={`min-h-screen ${isDark ? 'dark' : 'light'}`}>
          <LoadingScreen />
          <ParticleBackground />
          <Navbar />
          <MouseTrail />
          <main className="relative z-20">
            <Router />
          </main>
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
