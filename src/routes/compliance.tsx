import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/compliance")({
  component: ComplianceLayout,
});

function ComplianceLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
}

