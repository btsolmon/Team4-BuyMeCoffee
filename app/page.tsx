"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Coffee, Copy, ExternalLink } from "lucide-react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

/* ----------------------------- Types & data ----------------------------- */

type EarningsRange = "Last 30 days" | "Last 90 days" | "All time";

const EARNINGS_OPTIONS: EarningsRange[] = [
  "Last 30 days",
  "Last 90 days",
  "All time",
];

const EARNINGS_DATA: Record<EarningsRange, number> = {
  "Last 30 days": 450,
  "Last 90 days": 1280,
  "All time": 3940,
};

type AmountValue = 1 | 2 | 5 | 10;

const AMOUNT_OPTIONS: { label: string; value: AmountValue | null }[] = [
  { label: "All amounts", value: null },
  { label: "$1", value: 1 },
  { label: "$2", value: 2 },
  { label: "$5", value: 5 },
  { label: "$10", value: 10 },
];

type Avatar =
  | { kind: "initials"; initials: string }
  | { kind: "gradient"; gradient: string };

interface Transaction {
  id: number;
  name: string;
  handle: string;
  amount: AmountValue;
  time: string;
  avatar: Avatar;
  message?: string;
  messageExtra?: string; // shown only when "Show more" is expanded
}

const NAV_ITEMS = ["Home", "Explore", "View page", "Account settings"] as const;

const TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    name: "Guest",
    handle: "instagram.com/welesley",
    amount: 1,
    time: "10 hours ago",
    avatar: { kind: "initials", initials: "CN" },
    message:
      "Thank you for being so awesome everyday! You always manage to brighten up my day when I'm feeling down. Although $1 isn't that much money it's all I can contribute at the moment",
  },
  {
    id: 2,
    name: "John Doe",
    handle: "buymeacoffee.com/bdsadas",
    amount: 10,
    time: "10 hours ago",
    avatar: {
      kind: "gradient",
      gradient: "linear-gradient(135deg, #fb923c, #ec4899, #8b5cf6)",
    },
    message: "Thank you for being so awesome everyday!",
  },
  {
    id: 3,
    name: "Radicals",
    handle: "buymeacoffee.com/gkfgrew",
    amount: 2,
    time: "10 hours ago",
    avatar: { kind: "initials", initials: "CN" },
  },
  {
    id: 4,
    name: "Guest",
    handle: "facebook.com/penelopeb",
    amount: 5,
    time: "10 hours ago",
    avatar: {
      kind: "gradient",
      gradient: "linear-gradient(135deg, #f472b6, #a78bfa, #60a5fa)",
    },
  },
  {
    id: 5,
    name: "Fan1",
    handle: "buymeacoffee.com/supporterone",
    amount: 10,
    time: "10 hours ago",
    avatar: {
      kind: "gradient",
      gradient: "linear-gradient(135deg, #1e293b, #0f172a)",
    },
    message:
      "Thank you for being so awesome everyday! You always manage to brighten up my day when I'm feeling down. Although $1 isn't that much money it's all I can contribute at the moment. When I become successful I will be sure to buy you",
    messageExtra:
      " a whole bakery's worth of treats as a thank you for all your support.",
  },
  {
    id: 6,
    name: "Guest",
    handle: "instagram.com/welesley",
    amount: 1,
    time: "10 hours ago",
    avatar: { kind: "initials", initials: "CN" },
  },
];

const PAGE_URL = "buymeacoffee.com/baconpancakes1";

/* ------------------------------- Helpers -------------------------------- */

function useOutsideClick<T extends HTMLElement>(onOutside: () => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onOutside();
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [onOutside]);
  return ref;
}

function Avatar({ avatar, size = 40 }: { avatar: Avatar; size?: number }) {
  if (avatar.kind === "initials") {
    return (
      <div
        style={{ width: size, height: size }}
        className="flex shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-500"
      >
        {avatar.initials}
      </div>
    );
  }
  return (
    <div
      style={{ width: size, height: size, background: avatar.gradient }}
      className="shrink-0 rounded-full"
    />
  );
}

/* -------------------------------- Page ----------------------------------- */

export default function Page() {
  const [activeNav, setActiveNav] =
    useState<(typeof NAV_ITEMS)[number]>("Home");

  const [earningsRange, setEarningsRange] =
    useState<EarningsRange>("Last 30 days");
  const [earningsOpen, setEarningsOpen] = useState(false);
  const earningsRef = useOutsideClick<HTMLDivElement>(() =>
    setEarningsOpen(false),
  );

  const [amountFilter, setAmountFilter] = useState<AmountValue | null>(null);
  const [amountOpen, setAmountOpen] = useState(false);
  const amountRef = useOutsideClick<HTMLDivElement>(() => setAmountOpen(false));

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useOutsideClick<HTMLDivElement>(() =>
    setProfileOpen(false),
  );

  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  function toggleExpanded(id: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleShare() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`https://${PAGE_URL}`).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const filteredTransactions = amountFilter
    ? TRANSACTIONS.filter((t) => t.amount === amountFilter)
    : TRANSACTIONS;

  return (
    <div className="px-10 min-h-screen bg-white font-sans text-gray-900">
      <Header
        profileRef={profileRef}
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
      />

      <div className="flex">
        <Sidebar
          navItems={NAV_ITEMS}
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          pageUrl={PAGE_URL}
        />

        {/* Main content */}
        <main className="mx-auto w-full max-w-[859px] px-8 py-8">
          {/* Profile + earnings card */}
          <section className="rounded-2xl border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      background:
                        "linear-gradient(135deg, #fb7185, #f472b6, #818cf8)",
                    }}
                    className="rounded-full ring-4 ring-white"
                  />
                </div>
                <div>
                  <p className="text-base font-bold text-gray-900">Jake</p>
                  <p className="text-sm text-gray-500">{PAGE_URL}</p>
                </div>
              </div>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 cursor-pointer"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied!" : "Share page link"}
              </button>
            </div>

            <div className="mb-6 mt-5 h-0.5 bg-gray-200 w-full" />

            <div className="flex items-center gap-3">
              <span className="text-base font-bold text-gray-900">
                Earnings
              </span>
              <div className="relative" ref={earningsRef}>
                <button
                  onClick={() => setEarningsOpen((v) => !v)}
                  aria-haspopup="listbox"
                  aria-expanded={earningsOpen}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 cursor-pointer"
                >
                  {earningsRange}
                  <ChevronDown
                    size={16}
                    className={`text-gray-500 transition-transform ${
                      earningsOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {earningsOpen && (
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
                          setEarningsOpen(false);
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
              ${EARNINGS_DATA[earningsRange].toLocaleString()}
            </p>
          </section>

          {/* Recent transactions card */}
          <section className="mt-8 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <h2 className="text-lg font-bold text-gray-900">
                Recent transactions
              </h2>

              <div className="relative" ref={amountRef}>
                <button
                  onClick={() => setAmountOpen((v) => !v)}
                  aria-haspopup="listbox"
                  aria-expanded={amountOpen}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-50 cursor-pointer"
                >
                  <ChevronDown
                    size={16}
                    className={`text-gray-500 transition-transform ${
                      amountOpen ? "rotate-180" : ""
                    }`}
                  />
                  {amountFilter ? `$${amountFilter}` : "Amount"}
                </button>

                {amountOpen && (
                  <div
                    role="listbox"
                    className="absolute right-0 z-20 mt-2 w-36 rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
                  >
                    {AMOUNT_OPTIONS.map((opt) => (
                      <button
                        key={opt.label}
                        role="option"
                        aria-selected={opt.value === amountFilter}
                        onClick={() => {
                          setAmountFilter(opt.value);
                          setAmountOpen(false);
                        }}
                        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        {opt.label}
                        {opt.value === amountFilter && (
                          <Check size={14} className="text-gray-900" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {filteredTransactions.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-sm text-gray-500">
                  ${amountFilter} дүнтэй гүйлгээ олдсонгүй.
                </p>
                <button
                  onClick={() => setAmountFilter(null)}
                  className="mt-2 text-sm font-medium text-gray-900 underline"
                >
                  Бүх гүйлгээг харах
                </button>
              </div>
            ) : (
              <ul>
                {filteredTransactions.map((t) => {
                  const isExpanded = expanded.has(t.id);
                  return (
                    <li
                      key={t.id}
                      className="border-b border-gray-100 px-6 py-5 last:border-b-0"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <Avatar avatar={t.avatar} />
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {t.name}
                            </p>
                            <p className="text-xs text-gray-500">{t.handle}</p>
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-bold text-gray-900">
                            + ${t.amount}
                          </p>
                          <p className="text-xs text-gray-400">{t.time}</p>
                        </div>
                      </div>

                      {t.message && (
                        <p className="mt-2 text-sm leading-relaxed text-gray-700">
                          {t.message}
                          {t.messageExtra && (
                            <>
                              {isExpanded ? t.messageExtra : "..."}
                              {"  "}
                              <button
                                onClick={() => toggleExpanded(t.id)}
                                className="font-medium text-gray-900 underline"
                              >
                                {isExpanded ? "Show less" : "Show more"}
                              </button>
                            </>
                          )}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
