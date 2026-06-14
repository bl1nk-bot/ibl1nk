import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardMobile from "./pages/DashboardMobile";
import Outlines from "./pages/Outlines";
import CharactersWithViews from "./pages/CharactersWithViews";
import Settings from "./pages/Settings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={DashboardMobile} />
      <Route path="/outlines" component={Outlines} />
      <Route path="/characters" component={CharactersWithViews} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
