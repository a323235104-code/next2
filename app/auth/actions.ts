"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export type FormState = { error?: string; ok?: string } | undefined;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

/** 1. 회원가입: 성공하면 바로 로그인 상태로 메인으로 이동 */
export async function signup(_prev: FormState, fd: FormData): Promise<FormState> {
  const email = str(fd, "email");
  const password = String(fd.get("password") ?? "");
  const nickname = str(fd, "nickname");

  if (!EMAIL_RE.test(email)) return { error: "이메일 형식이 올바르지 않습니다." };
  if (password.length < 6) return { error: "비밀번호는 6자 이상이어야 합니다." };
  if (nickname.length < 1 || nickname.length > 20) return { error: "닉네임은 1~20자로 입력해 주세요." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nickname } },
  });

  if (error) {
    if (error.code === "user_already_exists" || /already registered/i.test(error.message)) {
      return { error: "이미 가입된 이메일입니다." };
    }
    if (error.code === "weak_password") return { error: "비밀번호가 너무 약합니다. 더 길게 입력해 주세요." };
    return { error: "회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요." };
  }

  // Supabase에서 이메일 인증이 켜져 있으면 세션 없이 가입만 됩니다.
  if (!data.session) {
    return { error: "가입은 되었지만 바로 로그인할 수 없습니다. (Supabase 이메일 인증 설정을 꺼 주세요)" };
  }

  redirect("/");
}

/** 2. 로그인: 실패하면 "이메일 또는 비밀번호가 틀렸습니다" */
export async function login(_prev: FormState, fd: FormData): Promise<FormState> {
  const email = str(fd, "email");
  const password = String(fd.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "이메일 또는 비밀번호가 틀렸습니다" };

  redirect("/");
}

/** 3. 로그아웃: 헤더의 로그아웃 버튼 */
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

/** 4. 마이페이지: 닉네임 수정 */
export async function updateNickname(_prev: FormState, fd: FormData): Promise<FormState> {
  const nickname = str(fd, "nickname");
  if (nickname.length < 1 || nickname.length > 20) return { error: "닉네임은 1~20자로 입력해 주세요." };

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const uid = data?.claims?.sub;
  if (!uid) redirect("/login");

  // RLS 규칙 때문에 본인 프로필만 바뀝니다.
  const { error } = await supabase.from("profiles").update({ nickname }).eq("id", uid);
  if (error) return { error: "닉네임을 바꾸지 못했습니다. 잠시 후 다시 시도해 주세요." };

  refresh();
  return { ok: "닉네임을 바꿨습니다." };
}

/** 5. 탈퇴: 계정과 프로필 삭제 후 메인으로 */
export async function deleteAccount(): Promise<FormState> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims?.sub) redirect("/login");

  // 데이터베이스 함수가 '지금 로그인한 본인' 계정만 지웁니다. 프로필은 함께 삭제됩니다.
  const { error } = await supabase.rpc("delete_own_account");
  if (error) return { error: "탈퇴하지 못했습니다. 잠시 후 다시 시도해 주세요." };

  // 이 브라우저에 남은 로그인 쿠키를 지웁니다.
  await supabase.auth.signOut({ scope: "local" });
  redirect("/");
}
