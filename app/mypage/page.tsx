import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getCurrentUser } from "@/utils/auth";
import { DeleteAccountButton, NicknameForm } from "./mypage-forms";

export const metadata: Metadata = { title: "마이페이지 | A2O LITE × 동백마을" };

/** 로그인 정보를 읽으므로 Suspense 안에서 그립니다. 비로그인 시 proxy와 여기서 모두 /login으로 보냅니다. */
async function MyPageContent() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto w-full max-w-md rounded-[2rem] border-2 border-ink bg-white p-6 shadow-[8px_8px_0_var(--color-ink)] sm:p-8">
      <h1 className="mb-6 font-heading text-3xl">마이페이지</h1>

      <dl className="mb-8 space-y-4">
        <div>
          <dt className="text-sm font-bold text-ink/60">이메일</dt>
          <dd className="text-lg break-all">{user.email}</dd>
        </div>
        <div>
          <dt className="text-sm font-bold text-ink/60">닉네임</dt>
          <dd className="text-lg">{user.nickname}</dd>
        </div>
      </dl>

      <NicknameForm nickname={user.nickname} />

      <div className="mt-10 border-t border-ink/10 pt-6">
        <DeleteAccountButton />
      </div>
    </div>
  );
}

export default function MyPage() {
  return (
    <main className="flex flex-1 items-start justify-center px-4 py-16 sm:py-24">
      <Suspense
        fallback={<div className="mx-auto h-96 w-full max-w-md animate-pulse rounded-[2rem] bg-ink/5" aria-label="불러오는 중" />}
      >
        <MyPageContent />
      </Suspense>
    </main>
  );
}
