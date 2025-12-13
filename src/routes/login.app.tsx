import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "@/components/login-form";

export const Route = createFileRoute("/login/app")({
  component: LoginAppPage,
});

function LoginAppPage() {
  return <LoginForm callbackUrl="https://focusd.so/callback/signup/app" />;
}

