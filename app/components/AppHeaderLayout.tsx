"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "./Header";
import type { HeaderUser } from "@/lib/auth";

export default function AppHeaderLayout({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialUser?: HeaderUser | null;
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<HeaderUser | null>(initialUser);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/profile/current-user", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setUser(data);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch (error) {
      console.error("Failed to log out:", error);
    }
    router.push("/login");
  };

  return (
    <>
      <Header
        profileRef={profileRef}
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
        user={user}
        handleLogout={handleLogout}
      />
      {children}
    </>
  );
}
