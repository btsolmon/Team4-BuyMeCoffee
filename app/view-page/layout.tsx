"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../components/Header";
import { User, Profile } from "@prisma/client";

type UserWithProfile = User & { profile: Profile };

function getUser(): UserWithProfile | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("user");
  return stored ? JSON.parse(stored) : null;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [user] = useState<UserWithProfile | null>(getUser);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    router.push("/");
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
