import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** 로그인해야만 볼 수 있는 경로 */
const PROTECTED = ["/mypage"];
/** 로그인한 사람은 볼 필요 없는 경로 */
const GUEST_ONLY = ["/login", "/signup"];

/** 요청마다 로그인 세션을 갱신하고, 경로별 접근을 정리합니다. */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
        },
      },
    },
  );

  // createServerClient와 getClaims 사이에는 다른 코드를 넣지 않습니다 (세션이 끊길 수 있음).
  const { data } = await supabase.auth.getClaims();
  const loggedIn = Boolean(data?.claims?.sub);

  const path = request.nextUrl.pathname;
  const redirectTo = (to: string) => {
    const url = request.nextUrl.clone();
    url.pathname = to;
    url.search = "";
    const res = NextResponse.redirect(url);
    // 갱신된 세션 쿠키를 리다이렉트 응답에도 옮겨 담습니다.
    response.cookies.getAll().forEach((c) => res.cookies.set(c));
    return res;
  };

  if (!loggedIn && PROTECTED.some((p) => path.startsWith(p))) return redirectTo("/login");
  if (loggedIn && GUEST_ONLY.some((p) => path.startsWith(p))) return redirectTo("/");

  return response;
}
