"use client";

import Image from "next/image";
import { useState } from "react";
import dongbaeki from "@/public/img/dongbaeki.png";
import ssiati from "@/public/img/ssiati.png";
import { Sparkle } from "./deco";

type Channel = "kakao" | "sms";

const PHONE_RE = /^01[016789]-?\d{3,4}-?\d{4}$/;

function formatPhone(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  if (d.length < 4) return d;
  if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
  if (d.length === 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
}

export function NotifyForm() {
  const [phone, setPhone] = useState("");
  const [channels, setChannels] = useState<Record<Channel, boolean>>({ kakao: true, sms: false });
  const [privacy, setPrivacy] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const allAgreed = privacy && marketing;

  function toggleChannel(c: Channel) {
    setChannels((prev) => ({ ...prev, [c]: !prev[c] }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!PHONE_RE.test(phone)) return setError("휴대폰 번호를 정확히 입력해 줘. (예: 010-1234-5678)");
    if (!channels.kakao && !channels.sms) return setError("알림 받을 방법을 하나 이상 골라 줘.");
    if (!privacy || !marketing) return setError("필수 동의 항목에 모두 동의해 줘.");
    setError("");

    // TODO: 발송 업체(카카오 브랜드 메시지 / 문자)가 정해지면 여기서 서버로 전송합니다.
    // 지금은 화면만 동작하고, 입력한 번호는 어디에도 저장·전송되지 않습니다.
    setDone(true);
  }

  const card = "relative rounded-[2rem] border-2 border-ink bg-white p-6 shadow-[8px_8px_0_var(--color-ink)] sm:p-8";

  if (done) {
    return (
      <div role="status" className={`${card} flex flex-col items-center py-12 text-center`}>
        <div className="pop mb-6 flex items-end gap-2">
          <Image src={dongbaeki} alt="" className="bob h-auto w-28" sizes="112px" />
          <Image src={ssiati} alt="" className="bob bob-delay h-auto w-20" sizes="80px" />
        </div>
        <Sparkle className="twinkle absolute right-8 top-8 h-10 w-10" />
        <p className="font-heading text-3xl">씨앗 심기 완료!</p>
        <p className="mt-4 text-lg leading-relaxed text-ink/80">
          12월, 동백이 피면 가장 먼저 알려줄게.
          <br />
          {channels.sms ? `${channels.kakao ? "카카오톡·" : ""}문자로` : "카카오톡으로"} 소식 보낼게!
        </p>
      </div>
    );
  }

  const channelBtn = (c: Channel, label: string) => (
    <label
      className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 py-3 font-bold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-cyan ${
        channels[c] ? "border-ink bg-pink text-white" : "border-ink/20 bg-white text-ink/60"
      }`}
    >
      <input type="checkbox" className="sr-only" checked={channels[c]} onChange={() => toggleChannel(c)} />
      <span aria-hidden="true">{channels[c] ? "✓" : "+"}</span>
      {label}
    </label>
  );

  return (
    <form onSubmit={handleSubmit} noValidate className={card}>
      <Sparkle className="twinkle absolute -right-4 -top-4 h-10 w-10" />
      <p className="mb-6 font-heading text-2xl sm:text-3xl">12월 출시 알림 신청</p>

      <label htmlFor="phone" className="mb-2 block font-bold">
        휴대폰 번호
      </label>
      <input
        id="phone"
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder="010-1234-5678"
        value={phone}
        onChange={(e) => setPhone(formatPhone(e.target.value))}
        className="mb-6 w-full rounded-2xl border-2 border-ink/20 px-4 py-3 text-lg outline-none focus:border-ink"
      />

      <fieldset className="mb-6">
        <legend className="mb-2 font-bold">받을 방법 (둘 다 골라도 돼)</legend>
        <div className="flex gap-3">
          {channelBtn("kakao", "카카오톡")}
          {channelBtn("sms", "문자")}
        </div>
      </fieldset>

      <div className="mb-5 rounded-2xl bg-sage/50 p-4 text-sm">
        <label className="mb-3 flex items-center gap-2 border-b border-ink/10 pb-3 font-bold">
          <input
            type="checkbox"
            className="h-5 w-5 accent-pink"
            checked={allAgreed}
            onChange={(e) => {
              setPrivacy(e.target.checked);
              setMarketing(e.target.checked);
            }}
          />
          전체 동의
        </label>

        <div className="mb-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="h-5 w-5 accent-pink" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} />
            <span>[필수] 개인정보 수집·이용 동의</span>
          </label>
          <details className="ml-7 mt-1 text-ink/65">
            <summary className="cursor-pointer underline underline-offset-2">내용 보기</summary>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>수집 항목: 휴대폰 번호</li>
              <li>이용 목적: A2O LITE × 동백마을 콜라보 굿즈 출시 알림 발송</li>
              <li>보관 기간: 출시 알림 발송 후 즉시 파기</li>
              <li>동의를 거부할 수 있으며, 거부 시 알림을 받을 수 없습니다.</li>
            </ul>
          </details>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="h-5 w-5 accent-pink" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
            <span>[필수] 출시 소식(광고성 정보) 수신 동의</span>
          </label>
          <details className="ml-7 mt-1 text-ink/65">
            <summary className="cursor-pointer underline underline-offset-2">내용 보기</summary>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>선택한 방법(카카오톡·문자)으로 콜라보 굿즈 출시 소식을 보내드립니다.</li>
              <li>받은 메시지 안내에 따라 언제든 수신을 거부할 수 있습니다.</li>
            </ul>
          </details>
        </div>
      </div>

      <p aria-live="polite" className="mb-3 min-h-5 text-sm font-bold text-camellia">
        {error}
      </p>

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-forest py-4 text-lg font-bold text-white shadow-[0_6px_0_-1px_var(--color-pink)] transition-transform hover:-translate-y-0.5"
      >
        알림받기 <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
