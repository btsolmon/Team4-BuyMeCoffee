"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "./Header";

type AppUser = {
  profile: {
    name: string;
    avatarImage?: string | null;
  };
} | null;

export default function AppHeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<AppUser>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/profile/current-user", { credentials: "same-origin" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
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
