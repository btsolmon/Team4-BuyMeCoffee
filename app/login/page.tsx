"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AuthShell,
  AuthCard,
  AuthCardHeader,
  AuthField,
  AuthSubmit,
} from "../components/AuthShell";

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
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.error || "Login failed");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell topRight={{ label: "Sign up", href: "/signup" }}>
      <AuthCard>
        <AuthCardHeader title="Welcome back" />
        <form
          onSubmit={handleSignin}
          className="flex flex-col gap-3 px-6 pb-2"
        >
          <AuthField
            label="Email"
            type="email"
            placeholder="Enter email here"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <AuthField
            label="Password"
            type="password"
            placeholder="Enter password here"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-[#18181b] underline-offset-2 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="pb-4 pt-3">
            <AuthSubmit disabled={loading || !email || !password}>
              {loading ? "Please wait..." : "Continue"}
            </AuthSubmit>
          </div>
        </form>
      </AuthCard>
    </AuthShell>
  );
}
