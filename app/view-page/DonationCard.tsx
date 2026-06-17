"use client";
import { useState } from "react";

export default function DonationCard({ creatorName }: { creatorName: string }) {
  const [amount, setAmount] = useState<number>(5);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm sticky top-6 ">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Buy {creatorName} a Coffee
      </h2>

      <div className="mb-4">
        <label className="text-xs font-bold text-gray-900 block mb-2">
          Select amount:
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 5, 10].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setAmount(item)}
              className={`py-2 rounded-lg text-sm font-medium border flex items-center justify-center gap-1 transition
                ${
                  amount === item
                    ? "border-gray-900 bg-white text-gray-900 ring-1 ring-gray-900 font-bold"
                    : "border-gray-100 bg-gray-50 hover:bg-gray-100 text-gray-700"
                }`}
            >
              ☕ ${item}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="text-xs font-bold text-gray-900 block mb-1.5">
          Enter BuyMeCoffee or social acount URL:
        </label>
        <input
          type="text"
          placeholder="buymeacoffee.com/"
          disabled
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white placeholder-gray-400 cursor-not-allowed"
        />
      </div>

      <div className="mb-6">
        <label className="text-xs font-bold text-gray-900 block mb-1.5">
          Special message:
        </label>
        <textarea
          rows={4}
          placeholder="Please write your message here"
          disabled
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white placeholder-gray-400 resize-none cursor-not-allowed"
        />
      </div>

      <button
        disabled
        className="w-full py-2.5 bg-gray-200 text-white font-medium rounded-lg text-sm cursor-not-allowed"
      >
        Support
      </button>
    </div>
  );
}
