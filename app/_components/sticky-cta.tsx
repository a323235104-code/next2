"use client";

import { useEffect, useState } from "react";

/** 모바일 하단 고정 '알림받기' 버튼. 첫 화면과 알림받기 섹션이 보일 때는 숨깁니다. */
export function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero-title");
    const notify = document.getElementById("notify");
    if (!hero || !notify) return;

    const inView = new Map<Element, boolean>();
    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) inView.set(e.target, e.isIntersecting);
      setVisible(!inView.get(hero) && !inView.get(notify));
    });
    observer.observe(hero);
    observer.observe(notify);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 p-3 transition-transform duration-300 sm:hidden ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
      aria-hidden={!visible}
    >
      <a
        href="#notify"
        tabIndex={visible ? 0 : -1}
        className="block rounded-2xl border-2 border-ink bg-forest py-4 text-center text-lg font-bold text-white shadow-[0_5px_0_-1px_var(--color-pink)]"
      >
        12월 출시 알림받기
      </a>
    </div>
  );
}
