"use client";

import { ExternalLink } from "lucide-react";
import { NavItemType } from "../types";

interface SidebarProps {
  navItems: readonly NavItemType[];
  activeNav: NavItemType;
  setActiveNav: (item: NavItemType) => void;
  pageUrl: string;
}

export default function Sidebar({
  navItems,
  activeNav,
  setActiveNav,
  pageUrl,
}: SidebarProps) {
  return (
    <aside className="ml-6 mt-2 w-62.75 shrink-0 px-4 py-6">
      <nav className="space-y-1">
        {navItems.map((item) =>
          item === "View page" ? (
            <a
              key={item}
              href={`https://${pageUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setActiveNav(item)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                activeNav === item
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {item}
              <ExternalLink size={14} className="ml-auto text-gray-400" />
            </a>
          ) : (
            <button
              key={item}
              onClick={() => setActiveNav(item)}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                activeNav === item
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {item}
            </button>
          ),
        )}
      </nav>
    </aside>
  );
}
