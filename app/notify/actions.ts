"use server";

/**
 * 알림받기 신청 → 구글 스프레드시트(Apps Script 웹 앱)로 전송.
 * 웹 앱 주소와 토큰은 서버 환경변수에만 두어 브라우저에 노출되지 않습니다.
 *   GOOGLE_SHEET_WEBHOOK_URL : Apps Script 웹 앱 URL
 *   GOOGLE_SHEET_TOKEN       : Apps Script의 TOKEN과 같은 값
 */

export type NotifyInput = {
  phone: string;
  kakao: boolean;
  sms: boolean;
  privacy: boolean;
  marketing: boolean;
  /** 봇 막기용 숨은 칸. 사람은 비워 둠 */
  website?: string;
};

export type NotifyResult = { ok: true } | { ok: false; error: string };

const PHONE_RE = /^01[016789]\d{7,8}$/;

/** 숫자만 남겨 010-1234-5678 형태로 통일 */
function normalizePhone(raw: string) {
  const d = raw.replace(/\D/g, "");
  if (!PHONE_RE.test(d)) return null;
  return d.length === 10 ? `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}` : `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
}

export async function subscribeNotify(input: NotifyInput): Promise<NotifyResult> {
  // 봇이 숨은 칸까지 채우면 조용히 성공한 척만 함
  if (input.website) return { ok: true };

  const phone = normalizePhone(String(input.phone ?? ""));
  if (!phone) return { ok: false, error: "휴대폰 번호를 정확히 입력해 줘. (예: 010-1234-5678)" };
  if (!input.kakao && !input.sms) return { ok: false, error: "알림 받을 방법을 하나 이상 골라 줘." };
  if (!input.privacy || !input.marketing) return { ok: false, error: "필수 동의 항목에 모두 동의해 줘." };

  const url = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  const token = process.env.GOOGLE_SHEET_TOKEN;
  if (!url || !token) {
    console.error("[notify] GOOGLE_SHEET_WEBHOOK_URL / GOOGLE_SHEET_TOKEN 환경변수가 없습니다.");
    return { ok: false, error: "지금은 신청을 받을 수 없어. 잠시 후 다시 시도해 줘." };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        phone,
        kakao: Boolean(input.kakao),
        sms: Boolean(input.sms),
        privacy: true,
        marketing: true,
      }),
      redirect: "follow", // Apps Script는 응답을 한 번 다른 주소로 넘겨서 돌려줌
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (!res.ok || !data?.ok) {
      console.error("[notify] 시트 저장 실패", res.status, data?.error);
      return { ok: false, error: "신청이 저장되지 않았어. 잠시 후 다시 시도해 줘." };
    }
    return { ok: true };
  } catch (err) {
    console.error("[notify] 시트 연결 오류", err);
    return { ok: false, error: "신청이 저장되지 않았어. 잠시 후 다시 시도해 줘." };
  }
}
