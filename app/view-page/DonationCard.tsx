"use client";
import { useState } from "react";

export default function DonationCard({
  creatorName,
  recipientId,
}: {
  creatorName: string;
  recipientId: string;
}) {
  const [amount, setAmount] = useState<number>(5);
  const [socialUrl, setSocialUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const res = await fetch("/api/donation/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipientId,
        amount,
        specialMessage: message || null,
        socialURLOrBuyMeACoffee: socialUrl || null,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Алдаа гарлаа");
      return;
    }

    setSuccess(true);
    setMessage("");
    setSocialUrl("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm sticky top-6"
    >
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
          value={socialUrl}
          onChange={(e) => setSocialUrl(e.target.value)}
          placeholder="buymeacoffee.com/"
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white placeholder-gray-400"
        />
      </div>

      <div className="mb-6">
        <label className="text-xs font-bold text-gray-900 block mb-1.5">
          Special message:
        </label>
        <textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Please write your message here"
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white placeholder-gray-400 resize-none"
        />
      </div>

      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
      {success && (
        <p className="text-sm text-green-600 mb-3">
          Thank you for your support!
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-gray-900 text-white font-medium rounded-lg text-sm hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? "Sending..." : "Support"}
      </button>
    </form>
  );
}
