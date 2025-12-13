import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Footer } from "@/components/footer";

import "../styles.css";
import { AppProvider } from "../lib/app-context";

export const Route = createRootRoute({
  component: () => (
    <div className="flex min-h-screen flex-col">
      <AppProvider>
        <div className="flex-1">
          <Outlet />
        </div>
        <Footer />
        <TanStackRouterDevtools />
      </AppProvider>
    </div>
  ),
});
