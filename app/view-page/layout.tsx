"use client";

import { useState, useRef } from "react";
import { Header } from "../components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null); // Хэрэв div дээр бол

  return (
    <>
      <Header
        profileRef={profileRef}
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
      />
      {children}
    </>
  );
}
