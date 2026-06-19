/* eslint-disable @next/next/no-img-element */
import { ExternalLink } from "lucide-react";
import { Creator } from "../types"; 

export function CreatorCard({ creator }: { creator: Creator }) {
  return (
    <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img 
            src={creator.avatarImage || "/default-avatar.png"} 
            alt={creator.name} 
            className="w-12 h-12 rounded-full object-cover border border-gray-100"
          />
          <h3 className="text-xl font-bold text-gray-900">{creator.name}</h3>
        </div>
        
        <a
          href={creator.socialMediaURL || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 transition-colors"
        >
          View profile
          <ExternalLink size={16} />
        </a>
      </div>

      {/* Grid бүтэц - таны 2-р скриншоттой адил */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h4 className="text-sm font-bold text-gray-900 mb-2">About {creator.name}</h4>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {creator.about || "No info"}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-900 mb-2">Social media URL</h4>
          <p className="text-sm text-indigo-600 truncate underline">
            {creator.socialMediaURL || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}