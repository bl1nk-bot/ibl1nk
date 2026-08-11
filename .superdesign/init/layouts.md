# Shared Layouts

## `client/src/App.tsx`

Root composition: ErrorBoundary → light ThemeProvider → TooltipProvider/Toaster → Wouter route switch. Full source:

```tsx
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import DashboardMobile from "./pages/DashboardMobile";
import Outlines from "./pages/Outlines";
import CharactersWithViews from "./pages/CharactersWithViews";
import Settings from "./pages/Settings";
function Router() {
  return (
    <Switch>
      <Route path="" component={Home} />
      <Route path="/dashboard" component={DashboardMobile} />
      <Route path="/outlines" component={Outlines} />
      <Route path="/characters" component={CharactersWithViews} />
      <Route path="/settings" component={Settings} />
      <Route path="/404" component={NotFound} />
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
```

## `client/src/components/DashboardLayout.tsx`

Reusable authenticated shell. It renders a resizable/collapsible Radix sidebar with 4 navigation routes (Dashboard, Stories, Characters, Settings), profile dropdown, mobile sticky header, and padded content inset. Source is 273 lines and should be passed directly for any page using this shell.

## `client/src/components/DashboardLayoutSkeleton.tsx`

Loading-state counterpart to `DashboardLayout`, with sidebar and content skeletons. Source should be passed directly when reproducing authenticated loading UI.
