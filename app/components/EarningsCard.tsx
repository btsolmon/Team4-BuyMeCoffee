"use client";

import { useState } from "react";
import { Check, ChevronDown, Copy } from "lucide-react";
import { Avatar } from "./Avatar";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { EARNINGS_OPTIONS, EarningsRange } from "../types";

type EarningsCardProps = {
  name: string;
  pageUrl: string;
  avatarSrc?: string | null;
  earnings: number;
  earningsRange: EarningsRange;
  setEarningsRange: (range: EarningsRange) => void;
  copied: boolean;
  onShare: () => void;
};

export function EarningsCard({
  name,
  pageUrl,
  avatarSrc,
  earnings,
  earningsRange,
  setEarningsRange,
  copied,
  onShare,
}: EarningsCardProps) {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClick<HTMLDivElement>(() => setOpen(false));

  return (
    <section className="rounded-2xl border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar src={avatarSrc} name={name} size={48} />
          <div>
            <p className="text-base font-bold text-gray-900">{name}</p>
            <p className="text-sm text-gray-500">{pageUrl || "—"}</p>
          </div>
        </div>

        <button
          onClick={onShare}
          className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 cursor-pointer"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied!" : "Share page link"}
        </button>
      </div>

      <div className="mb-6 mt-5 h-0.5 bg-gray-200 w-full" />

      <div className="flex items-center gap-3">
        <span className="text-base font-bold text-gray-900">Earnings</span>
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={open}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 cursor-pointer"
          >
            {earningsRange}
            <ChevronDown
              size={16}
              className={`text-gray-500 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {open && (
            <div
              role="listbox"
              className="absolute left-0 z-20 mt-2 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
            >
              {EARNINGS_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  role="option"
                  aria-selected={opt === earningsRange}
                  onClick={() => {
                    setEarningsRange(opt);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  {opt}
                  {opt === earningsRange && (
                    <Check size={14} className="text-gray-900" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900">
        ${earnings.toLocaleString()}
      </p>
    </section>
  );
}
