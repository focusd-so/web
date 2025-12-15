import { createFileRoute, Outlet, useMatch } from "@tanstack/react-router";
import { LoginForm } from "@/components/login-form";

export const Route = createFileRoute("/login/web")({
  component: LoginPage,
});

function LoginPage() {
  const callbackUrl = "/sso-callback?source=web";

  return <LoginForm callbackUrl={callbackUrl} />;
}
