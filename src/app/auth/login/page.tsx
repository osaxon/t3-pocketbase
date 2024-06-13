import { api } from "@/trpc/server";
import { LogInForm } from "../_components/LogInForm";

export default function LoginPage() {
  const login = api.auth.login;

  async function loginAction(data: FormData) {
    "use server";
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    if (!email || !password) {
      return;
    }
    try {
      await login({ email, password });
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="mx-auto max-w-xl">
      <LogInForm loginAction={loginAction} />
    </div>
  );
}
