import { createRootRoute, Outlet } from "@tanstack/react-router";

import "../styles.css";

export const Route = createRootRoute({
  component: () => (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  ),
});
