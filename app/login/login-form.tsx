"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login } from "@/app/auth/actions";
import { AuthCard, Field, FormMessage, SubmitButton } from "@/app/_components/auth-ui";

export function LoginForm() {
  const [state, action] = useActionState(login, undefined);

  return (
    <AuthCard title="로그인">
      <form action={action}>
        <Field label="이메일" name="email" type="email" autoComplete="email" required />
        <Field label="비밀번호" name="password" type="password" autoComplete="current-password" required />
        <FormMessage state={state} />
        <SubmitButton pendingText="로그인하는 중…">로그인</SubmitButton>
      </form>
      <p className="mt-6 text-center text-sm text-ink/70">
        아직 회원이 아닌가요?{" "}
        <Link href="/signup" className="font-bold text-ink underline underline-offset-4">
          회원가입
        </Link>
      </p>
    </AuthCard>
  );
}
