/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  AuthShell,
  AuthCard,
  AuthCardHeader,
  AuthField,
  AuthSubmit,
} from "../components/AuthShell";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setValidating(false);
      setTokenValid(false);
      return;
    }

    fetch(`/api/auth/verify-reset-token?token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => setTokenValid(Boolean(data.valid)))
      .catch(() => setTokenValid(false))
      .finally(() => setValidating(false));
  }, [token]);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Reset failed");
        return;
      }

      router.push("/login");
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell topRight={{ label: "Log in", href: "/login" }}>
      <AuthCard>
        {validating ? (
          <div className="p-6">
            <p className="text-sm text-[#71717a]">Verifying reset link...</p>
          </div>
        ) : !tokenValid ? (
          <div className="flex flex-col gap-4 p-6">
            <AuthCardHeader
              title="Invalid or expired link"
              description="This password reset link is invalid or has expired. Request a new one to continue."
            />
            <Link
              href="/forgot-password"
              className="text-center text-sm font-medium text-[#18181b] underline-offset-2 hover:underline"
            >
              Request a new link
            </Link>
          </div>
        ) : (
          <>
            <AuthCardHeader
              title="Set a new password"
              description="Choose a strong password for your account"
            />
            <form
              onSubmit={handleReset}
              className="flex flex-col gap-3 px-6 pb-2"
            >
              <AuthField
                label="New password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <AuthField
                label="Confirm password"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="pb-4 pt-3">
                <AuthSubmit
                  disabled={
                    loading || password.length < 8 || confirmPassword.length < 8
                  }
                >
                  {loading ? "Please wait..." : "Reset password"}
                </AuthSubmit>
              </div>
            </form>
          </>
        )}
      </AuthCard>
    </AuthShell>
  );
}
