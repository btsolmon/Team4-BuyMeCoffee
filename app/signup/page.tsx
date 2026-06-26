/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AuthShell,
  AuthCard,
  AuthCardHeader,
  AuthField,
  AuthSubmit,
} from "../components/AuthShell";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 — username
  const [username, setUsername] = useState("");
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);

  // Step 2 — email + password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Debounced username availability check
  useEffect(() => {
    const value = username.trim();
    if (!value) {
      setAvailable(null);
      return;
    }

    setChecking(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/auth/check-username?username=${encodeURIComponent(value)}`,
        );
        const data = await res.json();
        setAvailable(Boolean(data.available));
      } catch {
        setAvailable(null);
      } finally {
        setChecking(false);
      }
    }, 400);

    return () => clearTimeout(t);
  }, [username]);

  const emailValid = EMAIL_RE.test(email);

  function handleUsernameContinue(e: React.FormEvent) {
    e.preventDefault();
    if (available) setStep(2);
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!emailValid) {
      setEmailTouched(true);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.error || "Signup failed");
        return;
      }

      router.push("/view-page");
      router.refresh();
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell topRight={{ label: "Log in", href: "/login" }}>
      <AuthCard>
        {step === 1 ? (
          <>
            <AuthCardHeader
              title="Create Your Account"
              description="Choose a username for your page"
            />
            <form
              onSubmit={handleUsernameContinue}
              className="flex flex-col gap-3 px-6 pb-2"
            >
              <AuthField
                label="Username"
                type="text"
                placeholder="Enter username here"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                invalid={available === false}
                hint={
                  checking || available === null
                    ? undefined
                    : available
                      ? "Username available"
                      : "The username is already taken"
                }
                hintType={available ? "success" : "error"}
                required
              />
              <div className="pb-4 pt-3">
                <AuthSubmit disabled={!available || checking}>
                  Continue
                </AuthSubmit>
              </div>
            </form>
          </>
        ) : (
          <>
            <AuthCardHeader
              title={`Welcome, ${username}`}
              description="Connect email and set a password"
            />
            <form
              onSubmit={handleSignup}
              className="flex flex-col gap-3 px-6 pb-2"
            >
              <AuthField
                label="Email"
                type="email"
                placeholder="Enter email here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                invalid={emailTouched && !emailValid}
                hint={
                  emailTouched && !emailValid
                    ? "Please enter a valid email"
                    : undefined
                }
                hintType="error"
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
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="pb-4 pt-3">
                <AuthSubmit
                  disabled={loading || !emailValid || password.length < 8}
                >
                  {loading ? "Please wait..." : "Continue"}
                </AuthSubmit>
              </div>
            </form>
          </>
        )}
      </AuthCard>
    </AuthShell>
  );
}
