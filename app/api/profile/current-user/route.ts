import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { signTokens, verifyRefreshToken, verifyToken } from "@/lib/jwt";
import { setAuthCookies } from "@/lib/auth-cookies";

export async function GET() {
  try {
    const cookieStore = await cookies();
    let accessToken = cookieStore.get("access_token")?.value;
    let userId: string | undefined;
    let shouldRefreshCookies = false;
    let newTokens: ReturnType<typeof signTokens> | null = null;

    if (accessToken) {
      const payload = await verifyToken(accessToken);
      userId = payload?.sub as string | undefined;
    }

    if (!userId) {
      const refreshToken = cookieStore.get("refresh_token")?.value;
      if (refreshToken) {
        try {
          const payload = verifyRefreshToken(refreshToken);
          userId = payload.sub;
          newTokens = signTokens(userId);
          accessToken = newTokens.accessToken;
          shouldRefreshCookies = true;
        } catch {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
      } else {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true,
        profile: true,
        bankCard: {
          select: {
            id: true,
            country: true,
            firstName: true,
            lastName: true,
            expiryDate: true,
          },
        },
        receivedDonations: {
          select: {
            id: true,
            amount: true,
            specialMessage: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const response = NextResponse.json(user);
    if (shouldRefreshCookies && newTokens) {
      setAuthCookies(response, newTokens.accessToken, newTokens.refreshToken);
    }

    return response;
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
