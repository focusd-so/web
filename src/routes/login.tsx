import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  beforeLoad: ({ location, router }) => {
    // Only redirect if accessing /login directly, not child routes
    // Check if we're navigating to a child route by examining the current match
    const currentPath = location.pathname;
    const isExactLogin = currentPath === "/login" || currentPath === "/login/";
    
    // Don't redirect if we're already going to a child route
    const isChildRoute = currentPath.startsWith("/login/web") || currentPath.startsWith("/login/app");
    
    if (isExactLogin && !isChildRoute) {
      throw redirect({
        to: "/login/web",
      });
    }
  },
});
