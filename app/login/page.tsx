import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "로그인 | A2O LITE × 동백마을" };

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-start justify-center px-4 py-16 sm:py-24">
      <LoginForm />
    </main>
  );
}
