"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SigninPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.error || "Login failed");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSignin}
        className="w-full max-w-sm space-y-4 p-8 border rounded-xl shadow bg-white"
      >
        <h1 className="text-xl font-bold">Нэвтрэх</h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
          minLength={8}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-black text-white rounded disabled:opacity-50"
        >
          {loading ? "Түр хүлээнэ үү..." : "Нэвтрэх"}
        </button>
      </form>
    </div>
  );
}
