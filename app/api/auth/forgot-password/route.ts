import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createPasswordResetToken,
  sendPasswordResetEmail,
} from "@/lib/email";

const RESET_EXPIRY_MS = 60 * 60 * 1000;

function getRequestOrigin(req: NextRequest) {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");

  const forwardedHost = req.headers.get("x-forwarded-host");
  const host = forwardedHost ?? req.headers.get("host");
  if (host) {
    const proto =
      req.headers.get("x-forwarded-proto") ??
      (host.startsWith("localhost") || host.startsWith("127.0.0.1")
        ? "http"
        : "https");
    return `${proto}://${host}`;
  }

  return req.nextUrl.origin.replace(/\/+$/, "");
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const normalizedEmail = String(email ?? "").trim();

    if (!normalizedEmail) {
      return NextResponse.json({ message: "Email required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, email: true },
    });

    if (user) {
      const { token, hashedToken } = createPasswordResetToken();
      const expires = new Date(Date.now() + RESET_EXPIRY_MS);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: hashedToken,
          passwordResetExpires: expires,
        },
      });

      const origin = getRequestOrigin(req);
      const resetUrl = `${origin}/reset-password?token=${token}`;

      await sendPasswordResetEmail(user.email, resetUrl);
    }

    return NextResponse.json({
      message:
        "If an account exists with that email, we sent a password reset link.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
