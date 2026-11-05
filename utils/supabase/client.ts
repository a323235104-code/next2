import { createBrowserClient } from "@supabase/ssr";

/** 브라우저(클라이언트 컴포넌트)용 Supabase 클라이언트. 서버와 같은 쿠키 세션을 공유합니다. */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
