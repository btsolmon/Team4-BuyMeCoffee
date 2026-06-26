"use client";

import { useState } from "react";
import { Check, ChevronDown, Heart } from "lucide-react";
import { Avatar } from "./Avatar";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { AMOUNT_OPTIONS, AmountValue, Donation } from "../types";

export function RecentTransactions({ donations }: { donations: Donation[] }) {
  const [amountFilter, setAmountFilter] = useState<AmountValue | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useOutsideClick<HTMLDivElement>(() => setOpen(false));
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const filtered = amountFilter
    ? donations.filter((t) => t.amount === amountFilter)
    : donations;

  function toggleExpanded(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <section className="mt-8 rounded-2xl border border-gray-200">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
        <h2 className="text-lg font-bold text-gray-900">Recent transactions</h2>

        {donations.length > 0 && (
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-50 cursor-pointer"
            >
              <ChevronDown
                size={16}
                className={`text-gray-500 transition-transform ${
                  open ? "rotate-180" : ""
                }`}
              />
              {amountFilter ? `$${amountFilter}` : "Amount"}
            </button>

            {open && (
              <div className="absolute right-0 z-20 mt-2 w-36 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                {AMOUNT_OPTIONS.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => {
                      setAmountFilter(opt.value);
                      setOpen(false);
                    }}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
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
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
            <Heart size={32} className="text-black" />
          </div>
          <p className="text-gray-900 font-medium">
            You do not have any supporters yet
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Share your page with your audience to get started.
          </p>
        </div>
      ) : (
        <ul>
          {filtered.map((t) => {
            const isExpanded = expanded.has(t.id);
            return (
              <li
                key={t.id}
                className="border-b border-gray-100 px-6 py-5 last:border-b-0"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Avatar
                      src={t.donor?.profile?.avatarImage}
                      name={t.donor?.username || "Guest"}
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {t.donor?.username || "Guest"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {t.socialURLOrBuyMeACoffee || "No handle"}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-gray-900">
                      + ${t.amount}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(t.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {t.specialMessage && (
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">
                    {t.specialMessage}
                    {t.specialMessage.length > 100 && (
                      <>
                        {!isExpanded && "..."}
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
  );
}
