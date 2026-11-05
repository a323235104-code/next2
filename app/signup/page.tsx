import type { Metadata } from "next";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = { title: "회원가입 | A2O LITE × 동백마을" };

export default function SignupPage() {
  return (
    <main className="flex flex-1 items-start justify-center px-4 py-16 sm:py-24">
      <SignupForm />
    </main>
  );
}
