"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import dongbaeki from "@/public/img/dongbaeki.png";
import ssiati from "@/public/img/ssiati.png";
import { CONFIG, FallingSim } from "./falling-sim";

/**
 * 동백이·씨앗이가 비눗방울처럼 천천히 내려와 사이트 맨 아래에서 통통 튀며 쌓이는 배경 애니메이션.
 * - 처음 6개, 이후 몇 초마다 하나씩 새로 떨어짐
 * - 14개를 넘으면 오래된 것부터 2개씩 서서히 사라짐
 * - 글자·버튼 뒤(-z-10)에 깔리고 클릭을 막지 않음
 * - '움직임 줄이기' 설정이면 바닥에 나란히 앉아 있는 모습만 보여 줌
 */

const SLOTS = CONFIG.MAX_ALIVE + CONFIG.REMOVE_EACH; // 동시에 그릴 수 있는 최대 개수
const IMAGES = [dongbaeki, ssiati];

export function FallingCharacters() {
  const layer = useRef<HTMLDivElement>(null);
  const slots = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const box = layer.current;
    if (!box) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sim = new FallingSim(box.clientWidth, box.clientHeight, box.clientWidth < 640);
    if (reduced) {
      sim.seedStatic();
    } else {
      sim.seed();
    }

    // 캐릭터 → 그릴 칸(slot) 연결
    const slotOf = new Map<number, number>();

    const draw = () => {
      const used = new Set<number>();
      for (const b of sim.bodies) {
        let s = slotOf.get(b.id);
        if (s === undefined) {
          s = [...Array(SLOTS).keys()].find((k) => ![...slotOf.values()].includes(k));
          if (s === undefined) continue;
          slotOf.set(b.id, s);
          const img = slots.current[s]?.querySelectorAll("img");
          img?.forEach((el, k) => (el.style.display = k === b.kind ? "block" : "none"));
        }
        used.add(s);
        const el = slots.current[s];
        if (!el) continue;
        el.style.width = `${b.size}px`;
        el.style.opacity = String(Math.max(0, b.fade));
        el.style.transform = `translate3d(${b.x - b.size / 2}px, ${b.y - b.size / 2}px, 0) rotate(${b.rot}deg)`;
      }
      // 사라진 캐릭터의 칸 비우기
      for (const [id, s] of slotOf) {
        if (!used.has(s) || !sim.bodies.some((b) => b.id === id)) {
          slotOf.delete(id);
          const el = slots.current[s];
          if (el) el.style.opacity = "0";
        }
      }
    };

    if (reduced) {
      draw();
      return;
    }

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      sim.w = box.clientWidth;
      sim.h = box.clientHeight;
      const viewTop = -box.getBoundingClientRect().top; // 지금 보이는 화면 맨 위(무대 기준)
      sim.step(dt, viewTop);
      draw();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={layer} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {Array.from({ length: SLOTS }, (_, i) => (
        <div
          key={i}
          ref={(el) => {
            slots.current[i] = el;
          }}
          className="absolute left-0 top-0 opacity-0 will-change-transform"
        >
          {IMAGES.map((src, k) => (
            <Image key={k} src={src} alt="" className="hidden h-auto w-full" sizes="186px" />
          ))}
        </div>
      ))}
    </div>
  );
}
