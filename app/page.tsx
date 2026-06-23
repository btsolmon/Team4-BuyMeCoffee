/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  Coffee,
  Copy,
  ExternalLink,
  Heart,
} from "lucide-react";
import { Header } from "./components/Header";
import Sidebar from "./components/Sidebar";
import ExploreSection from "./components/ExploreSection"; // ExploreSection-оо импортлох
import { Profile, Donation, NAV_ITEMS, NavItemType } from "./types";

/* ----------------------------- Types & data ----------------------------- */

type EarningsRange = "Last 30 days" | "Last 90 days" | "All time";
const MOCK_DONATIONS: Donation[] = [
  {
    id: "don_1",
    amount: 1,
    specialMessage: "Thank you!",
    socialURLOrBuyMeACoffee: "instagram.com/welesley",
    donorId: "user_2",
    recipientId: "user_1",
    createdAt: new Date(),
    donor: {
      username: "Guest",
    },
  },
  {
    id: "don_2",
    amount: 10,
    specialMessage: "Keep it up!",
    socialURLOrBuyMeACoffee: "buymeacoffee.com/bdsadas",
    donorId: "user_3",
    recipientId: "user_1",
    createdAt: new Date(),
    donor: {
      username: "John Doe",
    },
  },
];

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

const PAGE_URL = "buymeacoffee.com/baconpancakes1";

function AccountSettingsSection() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">My account</h1>

      {/* Personal Info Section */}
      <Section title="Personal Info">
        <div className="flex items-center gap-4 mb-4">
          <div
            style={{
              width: 160,
              height: 160,
              background: "linear-gradient(135deg, #fb7185, #f472b6, #818cf8)",
            }}
            className="rounded-full ring-4 ring-white"
          />
        </div>
        <InputField label="Name" placeholder="Jake" />
        <TextAreaField label="About" placeholder="I'm a typical person..." />
        <InputField label="Social media URL" placeholder="https://..." />
        <SaveButton />
      </Section>

      {/* Set a new password Section */}
      <Section title="Set a new password">
        <InputField
          label="New password"
          type="password"
          placeholder="Enter new password"
        />
        <InputField
          label="Confirm password"
          type="password"
          placeholder="Confirm password"
        />
        <SaveButton />
      </Section>

      {/* Payment details Section */}
      <Section title="Payment details">
        <label className="block text-sm font-medium mb-1">Select country</label>
        <select className="w-full p-2 border rounded-lg mb-4">
          <option>United States</option>
        </select>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="First name" placeholder="Jake" />
          <InputField label="Last name" placeholder="Mulligan" />
        </div>
        <InputField
          label="Enter card number"
          placeholder="XXXX-XXXX-XXXX-XXXX"
        />
        <div className="grid grid-cols-3 gap-4">
          <InputField label="Expires" placeholder="August" />
          <InputField label="Year" placeholder="2028" />
          <InputField label="CVC" placeholder="590" />
        </div>
        <SaveButton />
      </Section>

      {/* Success page Section */}
      <Section title="Success page">
        <TextAreaField
          label="Confirmation message"
          placeholder="Thank you for supporting me!..."
        />
        <SaveButton />
      </Section>
    </div>
  );
}

/* Туслах бүрэлдэхүүн хэсгүүд */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <form className="border p-6 rounded-xl shadow-sm space-y-4">
      <h2 className="text-lg font-bold">{title}</h2>
      {children}
    </form>
  );
}

function InputField({ label, placeholder, type = "text" }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full p-2 border rounded-lg"
      />
    </div>
  );
}

function TextAreaField({ label, placeholder }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <textarea
        placeholder={placeholder}
        className="w-full p-2 border rounded-lg h-24"
      />
    </div>
  );
}

function SaveButton() {
  return (
    <button
      type="submit"
      className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
    >
      Save changes
    </button>
  );
}

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

/**
 * Renamed to AvatarDisplay to avoid conflict with the Avatar type definition.
 */
function AvatarDisplay({
  src,
  name,
  size = 40,
}: {
  src?: string | null;
  name: string;
  size?: number;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size }}
        className="shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size }}
      className="flex shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-500"
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

/* -------------------------------- Page ----------------------------------- */

export default function Page() {
  const [activeNav, setActiveNav] =
    useState<(typeof NAV_ITEMS)[number]>("Home");
  const [searchQuery, setSearchQuery] = useState("");
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

  // State for data from DB - Initialized with mock data for now
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [donations, setDonations] = useState<Donation[]>(MOCK_DONATIONS);
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    // This is where you will eventually fetch data from your Prisma/DB setup
  }, []);

  const filteredProfiles = profiles.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const filteredTransactions = amountFilter
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

  function handleShare() {
    navigator.clipboard.writeText(`https://${PAGE_URL}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

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
        <main className="mx-auto w-full max-w-214.75 px-8 py-8">
          {activeNav === "Explore" ? (
            <ExploreSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredCreators={filteredProfiles}
            />
          ) : activeNav === "Account settings" ? (
            <AccountSettingsSection />
          ) : (
            <>
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

                  {/* Amount filter dropdown-аа зөвхөн гүйлгээ байгаа үед л харуулах нь зүйтэй */}
                  {donations.length > 0 && (
                    <div className="relative" ref={amountRef}>
                      <button
                        onClick={() => setAmountOpen((v) => !v)}
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
                        <div className="absolute right-0 z-20 mt-2 w-36 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                          {AMOUNT_OPTIONS.map((opt) => (
                            <button
                              key={opt.label}
                              onClick={() => {
                                setAmountFilter(opt.value);
                                setAmountOpen(false);
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

                {/* Гүйлгээ хоосон үеийн загвар */}
                {filteredTransactions.length === 0 ? (
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
                    {filteredTransactions.map((t) => {
                      const isExpanded = expanded.has(t.id);
                      return (
                        <li
                          key={t.id}
                          className="border-b border-gray-100 px-6 py-5 last:border-b-0"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <AvatarDisplay
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
                                {new Date(t.createdAt).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  },
                                )}
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
                                    onClick={() => toggleExpanded(t.id!)}
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
            </>
          )}
        </main>
      </div>
    </div>
  );
}
