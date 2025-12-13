import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile/sessions-history")({
  component: SessionsHistoryPage,
});

function SessionsHistoryPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center gap-2 px-4 py-2">
        <h1 className="text-2xl font-bold">Sessions History</h1>
      </div>
      <div className="flex-1 rounded-xl bg-muted/50 p-4">
        <p className="text-muted-foreground">
          Sessions history content coming soon...
        </p>
      </div>
    </div>
  );
}

