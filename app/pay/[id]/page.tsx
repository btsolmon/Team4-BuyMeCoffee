"use client";
import { use, useEffect, useState } from "react";

type Status = "processing" | "success" | "error";

export default function PayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [status, setStatus] = useState<Status>("processing");

  useEffect(() => {
    let cancelled = false;

    const completePayment = async () => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;

        const res = await fetch(`${baseUrl}/api/payment/webhook`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transactionId: id, paymentType: "QPAY" }),
        });
        if (!res.ok) throw new Error("Webhook failed");
        if (!cancelled) setStatus("success");
      } catch {
        if (!cancelled) setStatus("error");
      }
    };

    completePayment();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
      {status === "processing" && (
        <>
          <div className="h-12 w-12 mb-4 rounded-full border-4 border-gray-200 border-t-indigo-600 animate-spin" />
          <p className="text-gray-600">Confirming your payment…</p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="h-16 w-16 mb-4 rounded-full bg-green-100 flex items-center justify-center text-3xl text-green-600">
            ✓
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Payment successful
          </h1>
          <p className="mt-2 text-gray-600">Thank you for your support!</p>
        </>
      )}

      {status === "error" && (
        <>
          <div className="h-16 w-16 mb-4 rounded-full bg-red-100 flex items-center justify-center text-3xl text-red-600">
            ✕
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Payment failed</h1>
          <p className="mt-2 text-gray-600">
            We couldn&apos;t confirm this payment. Please try again.
          </p>
        </>
      )}
    </div>
  );
}
