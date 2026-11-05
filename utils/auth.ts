import "server-only";
import { connection } from "next/server";
import { createClient } from "@/utils/supabase/server";

export type CurrentUser = {
  id: string;
  email: string;
  nickname: string;
};

/** 지금 로그인한 사용자(이메일·닉네임). 로그인하지 않았으면 null. */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  // 로그인 토큰 만료 확인에 현재 시각을 쓰므로, 미리 만들지 말고 요청이 올 때 처리합니다.
  await connection();
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return null;

  const { data: profile } = await supabase.from("profiles").select("nickname").eq("id", claims.sub).maybeSingle();

  return {
    id: claims.sub,
    email: typeof claims.email === "string" ? claims.email : "",
    nickname: profile?.nickname ?? "",
  };
}
