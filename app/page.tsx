import Image from "next/image";
import { BloomMark, FlowerBadge, Icon, LimeStroke, Orbit, PinkTag, Sparkle, Torn } from "./_components/deco";
import { FallingCharacters } from "./_components/falling-characters";
import { NotifyForm } from "./_components/notify-form";
import { StickyCta } from "./_components/sticky-cta";

import logo from "@/public/img/dongbaek-village-logo.png";
import dongbaeki from "@/public/img/dongbaeki.png";
import ssiati from "@/public/img/ssiati.png";
import heroForest from "@/public/img/hero-a-forest.webp";
import visitForest from "@/public/img/visit-forest.webp";
import originWoman from "@/public/img/origin-woman.webp";
import camelliaClose from "@/public/img/camellia-close.webp";
import holoCamellia from "@/public/img/holo-camellia.webp";
import hoodie from "@/public/img/hoodie.webp";
import sneakers from "@/public/img/sneakers.webp";
import keyring from "@/public/img/keyring.webp";
import charms from "@/public/img/charms.webp";

// ───────── 내용 데이터: 문구·제품이 바뀌면 여기만 고치면 됩니다 ─────────

const NEWS = [
  { icon: Icon.gift, label: "무엇을", text: "동백마을의 동백을 담은 A2O LITE 콜라보 굿즈" },
  { icon: Icon.calendar, label: "언제", text: "12월, 동백이 피는 계절에 출시 예정" },
  { icon: Icon.bell, label: "어떻게", text: "알림을 신청하면 카카오톡·문자로 가장 먼저" },
];

const COLORS = [
  { name: "동백 빨강", hex: "#e8202f" },
  { name: "분홍", hex: "#ff4fa3" },
  { name: "하늘색", hex: "#4cc3f5" },
  { name: "보라", hex: "#a77bf3" },
  { name: "노랑", hex: "#ffd23f" },
  { name: "잎 초록", hex: "#1d7a46" },
];

const GOODS = [
  { name: "후드티", desc: "등판 가득 피어난 A2O LITE × 동백", img: hoodie },
  { name: "스니커즈", desc: "발끝에 달린 홀로그램 동백", img: sneakers },
  { name: "아크릴 키링", desc: "다채로운 동백을 담은 키링", img: keyring },
  { name: "슈즈 참 · 미니 키링", desc: "신발에도, 가방에도 작게 한 송이", img: charms },
];

const VISIT = [
  { icon: Icon.calendar, label: "판매 기간", value: "12월 중 (날짜는 알림으로 먼저 알려줄게)" },
  { icon: Icon.pin, label: "판매 장소", value: "제주 동백마을 현장" },
  { icon: Icon.clock, label: "운영 시간", value: "곧 공개" },
];

// ───────────────────────────────────────────────────────────────

function Heading({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <h2
      id={id}
      className={`whitespace-pre-line font-heading text-[2.4rem] leading-[1.12] tracking-[-0.02em] sm:text-6xl ${className}`}
    >
      {children}
    </h2>
  );
}

function Eyebrow() {
  return (
    <p className="mb-4 text-sm tracking-tight sm:text-base">
      A2O LITE <span className="mx-1">×</span> <b className="font-black">DONGBAEK VILLAGE</b>
    </p>
  );
}

function Bubble({ who, children, img, flip = false }: { who: string; children: React.ReactNode; img: typeof dongbaeki; flip?: boolean }) {
  return (
    <div className={`flex items-end gap-3 ${flip ? "flex-row-reverse text-right" : ""}`}>
      <Image src={img} alt={who} className={`bob h-auto w-24 shrink-0 sm:w-32 ${flip ? "bob-delay" : ""}`} sizes="128px" />
      <div className="mb-6 rounded-3xl border-2 border-ink bg-white px-5 py-4 leading-relaxed shadow-[4px_4px_0_var(--color-ink)]">
        <p className="mb-1 font-heading text-lg">{who}</p>
        {children}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col">
      {/* 페이지 전체(본문+푸터)를 무대로, 캐릭터가 맨 아래까지 내려와 깔립니다 */}
      <FallingCharacters />
      <main id="top" className="flex-1 overflow-x-clip">
        {/* ── 1. 첫 화면: 동백숲에 들어온 A2O LITE 로고 ── */}
        <section aria-labelledby="hero-title" className="relative px-4 pb-16 pt-10 sm:pt-16">
          <LimeStroke className="absolute -left-6 top-40 hidden h-56 w-32 lg:block" />
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
            <div className="relative">
              <Eyebrow />
              <h1 id="hero-title" className="font-heading text-[2.9rem] leading-[1.08] tracking-[-0.03em] sm:text-7xl lg:text-6xl xl:text-7xl">
                12월, 동백이 피면
                <br />
                가장 먼저 알려줄게.
              </h1>
              <Sparkle className="twinkle absolute -top-2 right-4 h-9 w-9 sm:right-16" />
              <div className="mt-6">
                <PinkTag>A2O LITE × 동백마을 콜라보 굿즈 12월 출시</PinkTag>
              </div>
              <p className="mt-6 text-lg leading-relaxed text-ink/80">
                좋아하는 A2O LITE가 제주 동백숲에 피었어.
                <br />
                출시 소식, 제일 먼저 받아볼래?
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#notify"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-forest px-8 py-4 text-lg font-bold text-white shadow-[0_8px_0_-2px_var(--color-pink)] transition-transform hover:-translate-y-0.5"
                >
                  {Icon.bell} 알림받기 <span aria-hidden="true">→</span>
                </a>
                <a href="#story" className="px-2 py-3 text-center font-bold underline decoration-pink decoration-4 underline-offset-8">
                  먼저 둘러보기
                </a>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[560px]">
              <Torn seed={11} rotate={-2} className="aspect-[570/450]">
                <Image
                  src={heroForest}
                  alt="동백꽃이 핀 숲 사이에 서 있는 은빛 A2O LITE 조형물"
                  fill
                  preload
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="object-cover"
                />
              </Torn>
              <Orbit className="absolute -left-8 top-1/3 w-[115%] -rotate-6" />
              <Sparkle className="twinkle absolute -right-3 -top-4 h-12 w-12" />
              <Sparkle className="twinkle absolute -bottom-2 left-8 h-7 w-7 [animation-delay:-1s]" />
              <Image
                src={dongbaeki}
                alt=""
                className="bob absolute -bottom-10 -right-2 h-auto w-24 sm:w-32"
                sizes="128px"
              />
            </div>
          </div>
        </section>

        {/* ── 흐르는 띠 ── */}
        <div className="overflow-hidden border-y-2 border-ink bg-ink py-3 text-paper" aria-hidden="true">
          <div className="marquee flex w-max gap-10 whitespace-nowrap text-2xl sm:text-3xl">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="flex items-center gap-10">
                <BloomMark cut="var(--color-ink)" />
                <Sparkle className="h-6 w-6" />
                <span className="font-heading">12월, 동백마을에서</span>
                <Sparkle className="h-6 w-6" color="var(--color-lime)" />
              </span>
            ))}
          </div>
        </div>

        {/* ── 2. 콜라보 소식 ── */}
        <section id="story" aria-labelledby="story-title" className="scroll-mt-16 px-4 py-20 sm:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
            <div className="relative order-2 mx-auto w-full max-w-[460px] lg:order-1">
              <Torn seed={23} rotate={2} className="aspect-[600/760]">
                <Image src={keyring} alt="에코백에 달린 홀로그램 동백 아크릴 키링" fill sizes="(min-width: 1024px) 460px, 100vw" className="object-cover" />
              </Torn>
              <Sparkle className="twinkle absolute -left-4 top-10 h-10 w-10" />
              <Orbit className="absolute -right-10 bottom-16 w-[80%] rotate-12" />
            </div>
            <div className="order-1 lg:order-2">
              <Eyebrow />
              <Heading id="story-title">{"좋아하는 A2O LITE,\n이번엔 동백마을에서."}</Heading>
              <p className="mt-5 text-lg leading-relaxed text-ink/80">
                A2O LITE가 제주 동백마을과 만났어.
                <br />
                동백숲에서 피어난 콜라보 굿즈, 곧 공개돼.
              </p>
              <ul className="mt-8 space-y-4">
                {NEWS.map((n) => (
                  <li key={n.label} className="flex items-center gap-4">
                    <FlowerBadge>{n.icon}</FlowerBadge>
                    <p className="text-lg">
                      <b className="mr-2 font-heading">{n.label}</b>
                      {n.text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── 3. 이 꽃이 시작된 곳 + 캐릭터 ── */}
        <section id="village" aria-labelledby="village-title" className="relative scroll-mt-16 px-4 py-20 sm:py-28">
          <LimeStroke className="absolute right-0 top-10 hidden h-48 w-28 -scale-x-100 lg:block" />
          <div className="mx-auto max-w-6xl">
            <div className="relative mb-12 max-w-3xl">
              <Eyebrow />
              <Heading id="village-title">{"이 꽃이 시작된 곳,\n제주 동백마을이야."}</Heading>
              <p className="mt-5 text-lg leading-relaxed text-ink/80">
                굿즈 속 꽃을 따라가면 만나게 되는 마을.
                <br />
                붉은 동백과 초록 잎 사이에서 네가 좋아하는 장면을 찾아봐.
              </p>
              <span className="absolute -bottom-8 right-0 -rotate-12 font-script text-4xl text-pink sm:right-10 sm:text-5xl">
                Jeju Camellia
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
              <Torn seed={41} rotate={-1} className="aspect-[700/430]">
                <Image src={originWoman} alt="동백꽃을 만지며 웃는 방문객" fill sizes="(min-width: 768px) 60vw, 100vw" className="object-cover" />
              </Torn>
              <div className="grid grid-cols-2 gap-6 md:grid-cols-1 md:content-between">
                <Torn seed={53} rotate={2} className="aspect-[4/3] md:aspect-[380/250]">
                  <Image src={camelliaClose} alt="활짝 핀 붉은 동백꽃" fill sizes="(min-width: 768px) 35vw, 50vw" className="object-cover" />
                </Torn>
                <Torn seed={67} rotate={-2} className="aspect-[4/3] md:aspect-[472/300]">
                  <Image
                    src={visitForest}
                    alt="바다가 보이는 동백마을 길에서 콜라보 후드티를 입은 방문객"
                    fill
                    sizes="(min-width: 768px) 35vw, 50vw"
                    className="object-cover object-[50%_30%]"
                  />
                </Torn>
              </div>
            </div>

            {/* 동백숲 영상 + 캐릭터 소개 */}
            <div className="mt-20 grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
              <div className="relative">
                <Torn seed={79} rotate={1} className="aspect-video">
                  <video
                    className="h-full w-full object-cover"
                    src="/video/dongbaek-forest.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label="동백숲에서 바람에 날리는 꽃잎을 맞는 동백이와 씨앗이 애니메이션"
                  />
                </Torn>
                <Sparkle className="twinkle absolute -right-3 -top-5 h-10 w-10" />
                <Orbit className="absolute -bottom-8 -left-6 w-2/3 rotate-6" />
              </div>
              <div className="space-y-8">
                <Heading className="!text-4xl sm:!text-5xl">{"동백숲 친구들을\n소개할게!"}</Heading>
                <Bubble who="동백이" img={dongbaeki}>
                  안녕, 나는 동백이!
                  <br />
                  동백마을의 예쁜 순간을 보여줄게.
                </Bubble>
                <Bubble who="씨앗이" img={ssiati} flip>
                  나는 씨앗이야.
                  <br />
                  12월에 피어날 걸 품고 있지!
                </Bubble>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. 서로 다른 색이 모여 ── */}
        <section id="colors" aria-labelledby="colors-title" className="scroll-mt-16 px-4 py-20 sm:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
            <div>
              <Eyebrow />
              <Heading id="colors-title">{"서로 다른 색이 모여,\n하나의 동백으로."}</Heading>
              <p className="mt-5 text-lg leading-relaxed text-ink/80">
                동백의 꽃잎에 서로 다른 색을 겹쳤어.
                <br />
                분홍, 하늘색, 보라, 노랑이 모여 하나의 꽃으로.
              </p>
              <ul className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-6">
                {COLORS.map((c) => (
                  <li key={c.name} className="text-center text-sm">
                    <span className="mx-auto mb-2 block h-14 w-14 rounded-full border-2 border-ink" style={{ background: c.hex }} aria-hidden="true" />
                    {c.name}
                  </li>
                ))}
              </ul>
              <BloomMark stacked className="mt-10 block text-5xl leading-[0.95] sm:text-7xl" />
              <p className="mt-3 text-lg font-bold">너의 일상엔 어떤 색으로 어울릴까?</p>
            </div>
            <div className="relative">
              <Image src={holoCamellia} alt="분홍·하늘·보라·노랑 꽃잎이 겹쳐진 홀로그램 동백" className="h-auto w-full [mask-image:radial-gradient(closest-side,#000_78%,transparent)]" sizes="(min-width: 1024px) 560px, 100vw" />
            </div>
          </div>
        </section>

        {/* ── 5. 출시 예정 굿즈 ── */}
        <section id="goods" aria-labelledby="goods-title" className="relative scroll-mt-16 bg-ink px-4 py-20 text-paper sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="mb-4 text-sm sm:text-base">
                  A2O LITE × <b className="font-black">DONGBAEK VILLAGE</b>
                </p>
                <Heading id="goods-title">{"입고, 신고, 달고.\n네 방식대로 동백을 골라봐."}</Heading>
              </div>
              <div className="flex flex-col items-start gap-3 lg:items-end">
                <PinkTag>동백마을 현장 한정 판매</PinkTag>
                <p className="text-paper/70">스티커 세트까지, 12월에 모두 공개!</p>
              </div>
            </div>

            <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {GOODS.map((g) => (
                <li key={g.name} className="group overflow-hidden rounded-3xl bg-paper text-ink">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={g.img}
                      alt={g.name}
                      fill
                      sizes="(min-width: 1024px) 280px, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-pink px-3 py-1 text-xs font-bold text-white sm:text-sm">
                      12월 출시 예정
                    </span>
                  </div>
                  <div className="p-4 sm:p-5">
                    <p className="font-heading text-xl sm:text-2xl">{g.name}</p>
                    <p className="mt-1 text-sm text-ink/70">{g.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── 6. 알림받기 ── */}
        <section id="notify" aria-labelledby="notify-title" className="relative scroll-mt-16 px-4 py-20 sm:py-28">
          <Sparkle className="twinkle absolute left-[8%] top-16 h-10 w-10" />
          <Sparkle className="twinkle absolute right-[10%] top-40 hidden h-8 w-8 [animation-delay:-1.2s] sm:block" />
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.05fr]">
            <div>
              <Eyebrow />
              <Heading id="notify-title">{"동백마을에서 만나.\n오기 전, 알림부터!"}</Heading>
              <ul className="mt-8 space-y-4">
                {VISIT.map((v) => (
                  <li key={v.label} className="flex items-center gap-4">
                    <FlowerBadge>{v.icon}</FlowerBadge>
                    <p className="text-lg">
                      <b className="mr-2 font-heading">{v.label}:</b>
                      {v.value}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-lg leading-relaxed text-ink/80">
                제품별 가격, 판매 일정, 오시는 길까지.
                <br />
                정해지는 대로 카카오톡·문자로 가장 먼저 보내줄게.
              </p>
              <div className="mt-8 hidden items-end gap-2 lg:flex">
                <Image src={dongbaeki} alt="" className="bob h-auto w-36" sizes="144px" />
                <Image src={ssiati} alt="" className="bob bob-delay h-auto w-28" sizes="112px" />
              </div>
            </div>
            <NotifyForm />
          </div>
        </section>
      </main>

      <footer className="border-t-2 border-ink px-4 pb-28 pt-12 sm:pb-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
          <BloomMark className="text-5xl sm:text-7xl" bloomClassName="text-forest" wayClassName="text-pink" />
          <div className="flex items-center gap-3">
            <Image src={logo} alt="동백마을 로고" className="h-12 w-auto" sizes="56px" />
            <p className="text-sm">
              A2O LITE × <b className="font-black">DONGBAEK VILLAGE</b>
            </p>
          </div>
          <p className="text-sm text-ink/60">© 2026 동백마을. All rights reserved.</p>
        </div>
      </footer>

      <StickyCta />
    </div>
  );
}
