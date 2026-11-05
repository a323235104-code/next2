import type { Metadata } from "next";
import { Archivo_Black, Black_Han_Sans, Dancing_Script, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

// 한글 글꼴은 글자 수가 많아 미리 받지 않고(preload: false) 필요한 글자만 내려받습니다.
const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  weight: ["400", "500", "700", "900"],
  preload: false,
});

// 카드뉴스의 굵은 한글 제목
const blackHanSans = Black_Han_Sans({
  variable: "--font-black-han-sans",
  weight: "400",
  preload: false,
});

// BLOOM YOUR WAY 같은 영문 굵은 글자
const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  weight: "400",
  subsets: ["latin"],
});

// "Jeju Camellia" 같은 손글씨
const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  weight: ["600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "A2O LITE × 동백마을 | 12월, 동백이 피면 가장 먼저 알려줄게",
  description:
    "A2O LITE와 제주 동백마을의 콜라보 굿즈가 12월에 피어나요. 동백이·씨앗이와 함께 동백마을을 만나고, 출시 알림을 받아 보세요. BLOOM YOUR WAY.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${notoSansKr.variable} ${blackHanSans.variable} ${archivoBlack.variable} ${dancingScript.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
