/* eslint-disable @next/next/no-img-element */
import { Coffee, ChevronDown, LogOut } from "lucide-react";
import Link from "next/link";
import React from "react";
import { CurrentUser } from "../types";

interface HeaderProps {
  profileRef: React.RefObject<HTMLDivElement | null>;
  profileOpen: boolean;
  setProfileOpen: (open: boolean | ((prevState: boolean) => boolean)) => void;
  currentUser: CurrentUser | null;
  handleLogout: () => void;
}

export function Header({
  profileRef,
  profileOpen,
  setProfileOpen,
  currentUser,
  handleLogout,
}: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between px-10">
      <Link href="/" className="flex items-center gap-2">
        <Coffee size={24} strokeWidth={2.25} />
        <span className="text-[16px] font-bold">Buy Me Coffee</span>
      </Link>
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => setProfileOpen((v: boolean) => !v)}
          aria-haspopup="menu"
          aria-expanded={profileOpen}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-50 cursor-pointer"
        >
          {currentUser?.profile.avatarImage ? (
            <img
              src={currentUser.profile.avatarImage}
              alt={currentUser.profile.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200" />
          )}

          <span className="text-sm font-medium mr-10">
            {currentUser?.profile.name ?? "User"}
          </span>
          <ChevronDown
            size={16}
            className={`text-gray-500 transition-transform ${
              profileOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {profileOpen && (
          <div className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              <LogOut size={14} />
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
