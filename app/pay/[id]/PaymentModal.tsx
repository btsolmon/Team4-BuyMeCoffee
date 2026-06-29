"use client";
import { useEffect, useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  qrUrl?: string;
  transactionId?: string;
};

export default function PaymentModal({
  isOpen,
  onClose,
  qrUrl,
  transactionId,
}: Props) {
  const [tab, setTab] = useState<"card" | "qpay">("card");
  const [paid, setPaid] = useState(false);
  const [cardLoading, setCardLoading] = useState(false);
  const [cardError, setCardError] = useState("");

  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  useEffect(() => {
    if (!isOpen || !transactionId || tab !== "qpay") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/payment/status?transactionId=${transactionId}`,
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data.status === "COMPLETED") {
          setPaid(true);
          clearInterval(interval);
        }
      } catch {}
    }, 2000);

    return () => clearInterval(interval);
  }, [isOpen, transactionId, tab]);

  async function handleCardPay() {
    if (!name || !cardNumber || !expiry || !cvc) {
      setCardError("Бүх талбарыг бөглөнө үү");
      return;
    }
    if (!transactionId) {
      setCardError("Transaction олдсонгүй");
      return;
    }

    setCardLoading(true);
    setCardError("");

    try {
      const res = await fetch("/api/payment/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId, paymentType: "CARD" }),
      });

      if (!res.ok) throw new Error("Failed");
      setPaid(true);
    } catch {
      setCardError("Төлбөр хийхэд алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setCardLoading(false);
    }
  }

  if (!isOpen) return null;

  if (paid) {
    return (
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl p-8 w-[380px] flex flex-col items-center gap-5 shadow-2xl"
        >
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl text-green-600">
            ✓
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            Payment successful!
          </h3>
          <p className="text-sm text-gray-400 text-center">
            Thank you for your support!
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-8 w-[400px] relative shadow-2xl"
      >
<div className="flex justify-end w-full pb-6">
<button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 transition flex items-center justify-center text-sm"
        >
          ✕
        </button>
</div>

        <div className="flex bg-gray-100 rounded-xl p-1 mb-7">
          {(["card", "qpay"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t
                  ? "bg-white text-gray-900 shadow-sm font-semibold"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {t === "card" ? "Card" : "Q Pay"}
            </button>
          ))}
        </div>

        {tab === "card" && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-400 tracking-widest uppercase">
                Name on card
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First Last"
                className="w-full mt-1.5 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-300 outline-none focus:border-gray-400 transition"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 tracking-widest uppercase">
                Card number
              </label>
              <input
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="0000  0000  0000  0000"
                className="w-full mt-1.5 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-300 outline-none focus:border-gray-400 transition tracking-widest"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs font-semibold text-gray-400 tracking-widest uppercase">
                  Expiry
                </label>
                <input
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM / YY"
                  className="w-full mt-1.5 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-300 outline-none focus:border-gray-400 transition"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-semibold text-gray-400 tracking-widest uppercase">
                  CVC
                </label>
                <input
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  placeholder="···"
                  type="password"
                  maxLength={3}
                  className="w-full mt-1.5 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-300 outline-none focus:border-gray-400 transition"
                />
              </div>
            </div>

            {cardError && <p className="text-sm text-red-500">{cardError}</p>}

            <button
              onClick={handleCardPay}
              disabled={cardLoading}
              className="w-full py-3.5 mt-1 bg-gray-900 hover:bg-gray-700 text-white rounded-xl font-semibold text-sm tracking-wide transition disabled:opacity-50"
            >
              {cardLoading ? "Processing..." : "Pay now"}
            </button>
          </div>
        )}

        {tab === "qpay" && (
          <div className="flex flex-col items-center gap-5">
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900">Scan to pay</h3>
              <p className="text-sm text-gray-400 mt-1">
                Open QPay app and scan the QR code
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-center justify-center">
              {qrUrl ? (
                <img
                  src={qrUrl}
                  alt="QPay QR Code"
                  width={180}
                  height={180}
                  className="rounded-lg"
                />
              ) : (
                <div className="w-[180px] h-[180px] flex flex-col items-center justify-center gap-3 text-gray-300">
                  <div className="w-8 h-8 rounded-full border-[3px] border-gray-200 border-t-gray-800 animate-spin" />
                  <span className="text-xs">Loading...</span>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-300">
              QR code expires in 10 minutes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
