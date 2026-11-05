"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup } from "@/app/auth/actions";
import { AuthCard, Field, FormMessage, SubmitButton } from "@/app/_components/auth-ui";

export function SignupForm() {
  const [state, action] = useActionState(signup, undefined);

  return (
    <AuthCard title="회원가입">
      <form action={action}>
        <Field label="이메일" name="email" type="email" autoComplete="email" required />
        <Field label="비밀번호" name="password" type="password" autoComplete="new-password" minLength={6} required placeholder="6자 이상" />
        <Field label="닉네임" name="nickname" type="text" autoComplete="nickname" maxLength={20} required placeholder="1~20자" />
        <FormMessage state={state} />
        <SubmitButton pendingText="가입하는 중…">회원가입</SubmitButton>
      </form>
      <p className="mt-6 text-center text-sm text-ink/70">
        이미 계정이 있나요?{" "}
        <Link href="/login" className="font-bold text-ink underline underline-offset-4">
          로그인
        </Link>
      </p>
    </AuthCard>
  );
}
