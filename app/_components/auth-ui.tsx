"use client";

import { useFormStatus } from "react-dom";

/** 회원 화면 공통 카드 (사이트 카드뉴스 스타일) */
export function AuthCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-md rounded-[2rem] border-2 border-ink bg-white p-6 shadow-[8px_8px_0_var(--color-ink)] sm:p-8">
      <h1 className="mb-6 font-heading text-3xl">{title}</h1>
      {children}
    </div>
  );
}

export function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement> & { name: string }) {
  return (
    <div className="mb-5">
      <label htmlFor={props.name} className="mb-2 block font-bold">
        {label}
      </label>
      <input
        id={props.name}
        className="w-full rounded-2xl border-2 border-ink/20 px-4 py-3 text-lg outline-none focus:border-ink"
        {...props}
      />
    </div>
  );
}

export function SubmitButton({ children, pendingText }: { children: React.ReactNode; pendingText: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-2xl bg-forest py-4 text-lg font-bold text-white shadow-[0_6px_0_-1px_var(--color-pink)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
    >
      {pending ? pendingText : children}
    </button>
  );
}

export function FormMessage({ state }: { state?: { error?: string; ok?: string } }) {
  return (
    <p aria-live="polite" className={`mb-3 min-h-5 text-sm font-bold ${state?.error ? "text-camellia" : "text-leaf"}`}>
      {state?.error ?? state?.ok ?? ""}
    </p>
  );
}
