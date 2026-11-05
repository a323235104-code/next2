import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import logo from "@/public/img/dongbaek-village-logo.png";
import { logout } from "@/app/auth/actions";
import { getCurrentUser } from "@/utils/auth";

const linkCls = "rounded-full px-3 py-2 text-sm font-bold hover:bg-ink/5";

/** 로그인 상태에 따라 바뀌는 헤더 오른쪽 메뉴 (세션을 읽으므로 Suspense 안에서 그립니다) */
async function AuthNav() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <nav aria-label="계정" className="flex items-center">
        <Link href="/login" className={linkCls}>
          로그인
        </Link>
        <span aria-hidden="true" className="text-ink/30">
          /
        </span>
        <Link href="/signup" className={linkCls}>
          회원가입
        </Link>
      </nav>
    );
  }

  return (
    <nav aria-label="계정" className="flex items-center">
      <span className="max-w-[7rem] truncate px-2 text-sm sm:max-w-none">
        <b>{user.nickname || "회원"}</b>님
      </span>
      <span aria-hidden="true" className="text-ink/30">
        /
      </span>
      <Link href="/mypage" className={linkCls}>
        마이페이지
      </Link>
      <span aria-hidden="true" className="text-ink/30">
        /
      </span>
      <form action={logout}>
        <button type="submit" className={linkCls}>
          로그아웃
        </button>
      </form>
    </nav>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image src={logo} alt="동백마을 로고" className="h-10 w-auto" sizes="48px" />
          <span className="hidden text-sm lg:inline">
            A2O LITE × <b className="font-black">DONGBAEK VILLAGE</b>
          </span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-3">
          <Suspense fallback={<span className="h-9 w-32 animate-pulse rounded-full bg-ink/5" aria-hidden="true" />}>
            <AuthNav />
          </Suspense>
          <Link
            href="/#notify"
            className="hidden rounded-full bg-forest px-5 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 sm:inline-block"
          >
            알림받기
          </Link>
        </div>
      </div>
    </header>
  );
}
