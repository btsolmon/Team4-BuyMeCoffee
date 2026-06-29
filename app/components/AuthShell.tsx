"use client";

import { useState } from "react";
import { CheckCircle2, Coffee, Eye, EyeOff, XCircle } from "lucide-react";
import Link from "next/link";

export function AuthShell({
  topRight,
  children,
}: {
  topRight: { label: string; href: string };
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 flex w-full overflow-y-auto bg-white">
      {/* Left panel */}
      <div className="relative hidden w-1/2 overflow-hidden bg-[#fbbf24] md:block">
        <div className="absolute left-20 top-8 flex items-center gap-2">
          <Coffee size={20} className="text-[#09090b]" strokeWidth={2.25} />
          <span className="text-base font-bold tracking-[0.02em] text-[#09090b]">
            Buy Me Coffee
          </span>
        </div>

        <div className="absolute left-1/2 top-1/2 flex w-[455px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/auth-illustration.svg"
            alt="Buy Me Coffee"
            className="h-60 w-60"
          />
          <div className="flex flex-col items-center gap-3 text-center text-[#09090b]">
            <h2 className="text-2xl font-bold">Fund your creative work</h2>
            <p className="text-base leading-6">
              Accept support. Start a membership. Setup a shop. It&apos;s easier
              than you think.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="relative flex w-full items-center justify-center px-6 md:w-1/2">
        <Link
          href={topRight.href}
          className="absolute right-20 top-8 flex h-10 items-center justify-center rounded-md bg-[#f4f4f5] px-4 text-sm font-medium text-[#18181b] transition-colors hover:bg-[#e4e4e7]"
        >
          {topRight.label}
        </Link>

        {children}
      </div>
    </div>
  );
}

export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[407px] overflow-hidden rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      {children}
    </div>
  );
}

export function AuthCardHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 p-6">
      <h1 className="text-2xl font-semibold tracking-[-0.025em] text-[#09090b]">
        {title}
      </h1>
      {description && (
        <p className="text-sm text-[#71717a]">{description}</p>
      )}
    </div>
  );
}

export function AuthField({
  label,
  hint,
  hintType,
  invalid,
  type,
  ...props
}: {
  label: string;
  hint?: string;
  hintType?: "success" | "error";
  invalid?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (show ? "text" : "password") : type;

  return (
    <div className="flex w-full flex-col gap-2">
      <label className="text-sm font-medium text-[#09090b]">{label}</label>
      <div className="relative">
        <input
          {...props}
          type={inputType}
          className={`h-10 w-full rounded-md border bg-white px-3 py-2 text-sm text-[#09090b] outline-none placeholder:text-[#71717a] focus:ring-2 ${
            isPassword ? "pr-10" : ""
          } ${
            invalid
              ? "border-red-500 focus:ring-red-500/20"
              : "border-[#e4e4e7] focus:ring-[#18181b]/10"
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            tabIndex={-1}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717a] transition-colors hover:text-[#09090b]"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {hint && (
        <div
          className={`flex items-center gap-1.5 text-xs ${
            hintType === "error" ? "text-red-500" : "text-green-600"
          }`}
        >
          {hintType === "error" ? (
            <XCircle size={14} />
          ) : (
            <CheckCircle2 size={14} />
          )}
          <span>{hint}</span>
        </div>
      )}
    </div>
  );
}

export function AuthSubmit({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="flex h-10 w-full items-center justify-center rounded-md bg-[#18181b] px-4 text-sm font-medium text-[#fafafa] transition-opacity hover:bg-[#18181b]/90 disabled:opacity-20"
    >
      {children}
    </button>
  );
}
