"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AuthShell,
  AuthCard,
  AuthCardHeader,
  AuthField,
  AuthSubmit,
} from "../components/AuthShell";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const emailValid = EMAIL_RE.test(email);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!emailValid) {
      setError("Please enter a valid email");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Something went wrong");
        return;
      }

      setSent(true);
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell topRight={{ label: "Log in", href: "/login" }}>
      <AuthCard>
        {sent ? (
          <div className="flex flex-col gap-4 p-6">
            <AuthCardHeader
              title="Check your email"
              description={`We have sent a password reset link to ${email}. The link expires in 1 hour.`}
            />
            <Link
              href="/login"
              className="text-center text-sm font-medium text-[#18181b] underline-offset-2 hover:underline"
            >
              Back to login
            </Link>
          </div>
        ) : (
          <>
            <AuthCardHeader
              title="Reset your password"
              description="Enter the email linked to your account and we'll send you a reset link"
            />
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 px-6 pb-2"
            >
              <AuthField
                label="Email"
                type="email"
                placeholder="Enter email here"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                invalid={Boolean(error)}
                hint={error || undefined}
                hintType="error"
                required
              />
              <div className="pb-4 pt-3">
                <AuthSubmit disabled={loading || !emailValid}>
                  {loading ? "Please wait..." : "Send reset link"}
                </AuthSubmit>
              </div>
            </form>
          </>
        )}
      </AuthCard>
    </AuthShell>
  );
}
