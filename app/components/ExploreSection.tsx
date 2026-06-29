"use client";

import { Search, User } from "lucide-react"; // User icon нэмэх
import { CreatorCard } from "./CreatorCard";
import { Profile } from "../types";

interface ExploreSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredCreators: Profile[];
}

export default function ExploreSection({
  searchQuery,
  setSearchQuery,
  filteredCreators,
}: ExploreSectionProps) {
  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900">Explore creators</h1>

      <div className="relative mb-8 mt-4 max-w-sm">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search name"
          className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
      </div>

      {filteredCreators.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
            <User size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-900 font-medium">
            No creators have signed up yet
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredCreators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      )}
    </>
  );
}
