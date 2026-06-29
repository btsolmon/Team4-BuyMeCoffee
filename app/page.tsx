/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "./components/Header";
import Sidebar from "./components/Sidebar";
import ExploreSection from "./components/ExploreSection";
import { AccountSettings } from "./components/AccountSettings";
import { EarningsCard } from "./components/EarningsCard";
import { RecentTransactions } from "./components/RecentTransactions";
import { useOutsideClick } from "./hooks/useOutsideClick";
import {
  CurrentUser,
  Donation,
  EARNINGS_DAYS,
  EarningsRange,
  NAV_ITEMS,
  Profile,
} from "./types";

export default function Page() {
  const router = useRouter();

  const [activeNav, setActiveNav] =
    useState<(typeof NAV_ITEMS)[number]>("Home");
  const [searchQuery, setSearchQuery] = useState("");
  const [earningsRange, setEarningsRange] =
    useState<EarningsRange>("Last 30 days");

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useOutsideClick<HTMLDivElement>(() =>
    setProfileOpen(false),
  );

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [earnings, setEarnings] = useState(0);
  const [copied, setCopied] = useState(false);
  const [pageUrl, setPageUrl] = useState("");

  useEffect(() => {
    if (currentUser) {
      setPageUrl(`${window.location.host}/${encodeURIComponent(currentUser.username)}`);
    }
  }, [currentUser]);

  useEffect(() => {
    fetch("/api/profile/explore")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) =>
        setProfiles(
          data.map((u: { username: string; profile: Profile }) => ({
            ...u.profile,
            username: u.username,
          })),
        ),
      )
      .catch(() => setProfiles([]));

    fetch("/api/profile/current-user", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((user) => {
        if (!user) return;
        setCurrentUser(user);
        return fetch(`/api/donation/received/${user.id}`);
      })
      .then((res) => (res?.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setDonations(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const days = EARNINGS_DAYS[earningsRange];
    const url =
      days === null
        ? `/api/donation/total-earnings/${currentUser.id}`
        : `/api/donation/total-earnings/${currentUser.id}?days=${days}`;

    fetch(url)
      .then((res) => (res.ok ? res.json() : { total: 0 }))
      .then((data) => setEarnings(data.total ?? 0))
      .catch(() => setEarnings(0));
  }, [currentUser, earningsRange]);

  const filteredProfiles = profiles.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  function handleShare() {
    if (!currentUser) return;
    navigator.clipboard.writeText(
      `${window.location.origin}/${encodeURIComponent(currentUser.username)}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
      alert("Logout failed. Please try again.");
    }
  }

  return (
    <div className="px-10 min-h-screen bg-white font-sans text-gray-900">
      <Header
        profileRef={profileRef}
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
        user={currentUser}
        handleLogout={handleLogout}
        onLogoClick={() => setActiveNav("Home")}
      />

      <div className="flex">
        <Sidebar
          navItems={NAV_ITEMS}
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          pageUrl={pageUrl}
        />

        <main className="mx-auto w-full max-w-214.75 px-8 py-8">
          {activeNav === "Explore" ? (
            <ExploreSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredCreators={filteredProfiles}
            />
          ) : activeNav === "Account settings" ? (
            <AccountSettings currentUser={currentUser} />
          ) : (
            <>
              <EarningsCard
                name={currentUser?.profile.name ?? "—"}
                pageUrl={pageUrl}
                avatarSrc={currentUser?.profile.avatarImage}
                earnings={earnings}
                earningsRange={earningsRange}
                setEarningsRange={setEarningsRange}
                copied={copied}
                onShare={handleShare}
              />
              <RecentTransactions donations={donations} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
