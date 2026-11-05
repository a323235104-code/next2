"use client";

import { useActionState, useState, useTransition } from "react";
import { deleteAccount, updateNickname, type FormState } from "@/app/auth/actions";
import { Field, FormMessage, SubmitButton } from "@/app/_components/auth-ui";

export function NicknameForm({ nickname }: { nickname: string }) {
  const [state, action] = useActionState(updateNickname, undefined);

  return (
    <form action={action}>
      <Field label="닉네임 수정" name="nickname" type="text" defaultValue={nickname} maxLength={20} required />
      <FormMessage state={state} />
      <SubmitButton pendingText="저장하는 중…">닉네임 저장</SubmitButton>
    </form>
  );
}

export function DeleteAccountButton() {
  const [pending, startTransition] = useTransition();
  const [state, setState] = useState<FormState>(undefined);

  function onClick() {
    // 확인 창 한 번
    if (!window.confirm("정말 탈퇴할까요? 계정과 프로필이 삭제되며 되돌릴 수 없습니다.")) return;
    startTransition(async () => {
      const result = await deleteAccount();
      if (result) setState(result);
    });
  }

  return (
    <>
      <FormMessage state={state} />
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className="w-full rounded-2xl border-2 border-camellia py-3 font-bold text-camellia transition-colors hover:bg-camellia hover:text-white disabled:opacity-60"
      >
        {pending ? "탈퇴 처리 중…" : "회원 탈퇴"}
      </button>
    </>
  );
}
