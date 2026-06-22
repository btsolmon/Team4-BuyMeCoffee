/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { ChevronDown, Heart } from "lucide-react";

interface Donation {
  id: string;
  amount: number;
  specialMessage: string | null;
  donorName: string;
  avatarImage: string;
}

export const Supporter = ({ name }: { name: string }) => {
  const [supporters, setSupporters] = useState<Donation[]>([]);

  const hasSupporters = supporters && supporters.length > 0;

  return (
    <div className="p-6 bg-white rounded-xl border border-[#E4E4E7] space-y-6 ">
      <h2 className="text-[18px] font-bold text-gray-900">Recent Supporters</h2>

      {hasSupporters ? (
        <div className="space-y-6">
          <div className="space-y-6">
            {supporters.map((donation) => (
              <div key={donation.id} className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                  <img
                    src={donation.avatarImage}
                    alt={donation.donorName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 pt-0.5 space-y-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-bold text-[15px]">
                      {donation.donorName}
                    </span>{" "}
                    <span className="text-gray-600">
                      bought ${donation.amount} coffee
                    </span>
                  </p>
                  {donation.specialMessage && (
                    <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                      {donation.specialMessage}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button className="w-full py-2.5 border border-[#E4E4E7] rounded-xl text-sm font-medium text-gray-900 hover:bg-gray-50 flex items-center justify-center gap-1.5 transition">
            See more
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      ) : (
        <div className="p-12 rounded-xl border border-[#E4E4E7] flex flex-col items-center justify-center text-center">
          <Heart className="w-5 h-5 text-gray-900 fill-current mb-3" />
          <p className="text-sm font-medium text-gray-900">
            Be the first one to support {name}
          </p>
        </div>
      )}
    </div>
  );
};
