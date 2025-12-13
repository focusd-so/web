import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "@/components/login-form";

export const Route = createFileRoute("/login/web")({
  component: LoginWebPage,
});

function LoginWebPage() {
  return <LoginForm callbackUrl="https://focusd.so/callback/signup/web" />;
}

