// 카드뉴스 레퍼런스의 꾸밈 요소: 찢긴 종이 액자, 분홍 반짝이, 하늘색 궤도선, 연두 붓선, BLOOM YOUR WAY 마크

/** 시드값으로 매번 같은 모양의 '찢긴 종이' 가장자리를 만듭니다. */
function tornPolygon(seed: number, edges: { t?: boolean; r?: boolean; b?: boolean; l?: boolean }) {
  let s = seed;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const step = 2.5;
  const amp = 2.4;
  const pts: string[] = [];
  const j = (on?: boolean) => (on ? rnd() * amp : 0);
  for (let x = 0; x <= 100; x += step) pts.push(`${x}% ${j(edges.t)}%`);
  for (let y = step; y <= 100; y += step) pts.push(`${100 - j(edges.r)}% ${y}%`);
  for (let x = 100 - step; x >= 0; x -= step) pts.push(`${x}% ${100 - j(edges.b)}%`);
  for (let y = 100 - step; y > 0; y -= step) pts.push(`${j(edges.l)}% ${y}%`);
  return `polygon(${pts.join(",")})`;
}

/** 찢긴 종이 액자: 흰 종이 테두리 + 그림자 */
export function Torn({
  children,
  seed = 7,
  edges = { t: true, r: true, b: true, l: true },
  className = "",
  rotate = 0,
}: {
  children: React.ReactNode;
  seed?: number;
  edges?: { t?: boolean; r?: boolean; b?: boolean; l?: boolean };
  className?: string;
  rotate?: number;
}) {
  const clip = tornPolygon(seed, edges);
  return (
    <div
      className={`drop-shadow-[0_10px_18px_rgba(17,17,17,0.18)] ${className}`}
      style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined }}
    >
      <div className="h-full bg-white p-[6px]" style={{ clipPath: clip }}>
        <div className="relative h-full overflow-hidden" style={{ clipPath: clip }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/** 분홍 네 갈래 반짝이 */
export function Sparkle({ className = "", color = "var(--color-pink)" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`pointer-events-none ${className}`}>
      <path d="M12 0C12.9 7.6 16.4 11.1 24 12C16.4 12.9 12.9 16.4 12 24C11.1 16.4 7.6 12.9 0 12C7.6 11.1 11.1 7.6 12 0Z" fill={color} />
    </svg>
  );
}

/** 하늘색 궤도선 */
export function Orbit({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 140" fill="none" aria-hidden="true" className={`pointer-events-none ${className}`}>
      <path
        d="M8 92C40 30 210 4 330 22C420 36 400 98 300 120C200 142 60 132 20 104"
        stroke="var(--color-cyan)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** 연두 붓선 */
export function LimeStroke({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 200" fill="none" aria-hidden="true" className={`pointer-events-none ${className}`}>
      <path
        d="M20 190C10 130 30 70 70 40C90 25 110 20 112 8"
        stroke="var(--color-lime)"
        strokeWidth="14"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
}

/** 꽉 찬 O 안에 반짝이 구멍 */
function BloomO({ cut }: { cut: string }) {
  return (
    <span className="relative mx-[0.015em] inline-block h-[0.74em] w-[0.76em] rounded-full bg-current">
      <Sparkle color={cut} className="absolute left-1/2 top-1/2 h-[0.5em] w-[0.5em] -translate-x-1/2 -translate-y-1/2" />
    </span>
  );
}

/** BLOOM YOUR WAY — 꽉 찬 O 안에 반짝이를 뚫은 카드뉴스 로고타입 */
export function BloomMark({
  className = "",
  cut = "var(--color-paper)",
  stacked = false,
  bloomClassName = "",
  wayClassName = "",
}: {
  className?: string;
  /** 반짝이 구멍 색 = 뒤 배경색 */
  cut?: string;
  /** BLOOM / YOUR WAY 두 줄 */
  stacked?: boolean;
  /** BLOOM 부분만 따로 색 지정 (예: "text-forest") */
  bloomClassName?: string;
  /** YOUR WAY 부분만 따로 색 지정 (예: "text-pink") */
  wayClassName?: string;
}) {
  return (
    <span role="img" className={`font-display tracking-[-0.04em] ${className}`} aria-label="BLOOM YOUR WAY">
      <span aria-hidden="true" className={`whitespace-nowrap ${bloomClassName}`}>
        BL<BloomO cut={cut} />
        <BloomO cut={cut} />M
      </span>
      {stacked ? <br /> : " "}
      <span aria-hidden="true" className={`whitespace-nowrap ${wayClassName}`}>
        YOUR WAY
      </span>
    </span>
  );
}

/** 카드뉴스의 형광 분홍 붓질 라벨 */
export function PinkTag({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-block -rotate-1 bg-pink px-4 py-1.5 text-base font-bold text-white sm:text-lg ${className}`}
      style={{ borderRadius: "14px 6px 16px 5px / 8px 14px 6px 12px" }}
    >
      {children}
    </span>
  );
}

/** 꽃 모양 아이콘 배지 (방문정보 카드 스타일) */
export function FlowerBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-flex h-14 w-14 shrink-0 items-center justify-center">
      <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute inset-0 h-full w-full">
        {[0, 72, 144, 216, 288].map((d) => (
          <circle key={d} cx="50" cy="27" r="25" fill="var(--color-sage)" transform={`rotate(${d} 50 50)`} />
        ))}
        <circle cx="50" cy="50" r="28" fill="var(--color-sage)" />
      </svg>
      <span className="relative text-ink">{children}</span>
    </span>
  );
}

export const Icon = {
  calendar: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 22s7-6.6 7-12a7 7 0 1 0-14 0c0 5.4 7 12 7 12Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" />
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16Z" strokeLinejoin="round" />
      <path d="M10 21h4" strokeLinecap="round" />
    </svg>
  ),
  gift: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="9" width="18" height="12" rx="2" />
      <path d="M3 13h18M12 9v12M12 9C10 4 6 5 7.5 7.5 8.5 9 12 9 12 9Zm0 0c2-5 6-4 4.5-1.5C15.5 9 12 9 12 9Z" strokeLinejoin="round" />
    </svg>
  ),
};
