import { cookies } from "next/headers";
import { verifyRefreshToken, verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export type HeaderUser = {
  profile: {
    name: string;
    avatarImage?: string | null;
  };
};

export function toHeaderUser(
  user: Awaited<ReturnType<typeof getCurrentUser>>,
): HeaderUser | null {
  if (!user) return null;
  return {
    profile: {
      name: user.profile.name,
      avatarImage: user.profile.avatarImage,
    },
  };
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  if (!accessToken) return null;

  const payload = await verifyToken(accessToken);
  if (!payload?.sub) return null;

  return prisma.user.findUnique({
    where: { id: payload.sub as string },
    include: { profile: true },
  });
}

export async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    const refreshToken = cookieStore.get("refresh_token")?.value;
    if (!refreshToken) return null;

    try {
      const payload = verifyRefreshToken(refreshToken);
      return payload.sub ?? null;
    } catch {
      return null;
    }
  }

  const payload = await verifyToken(accessToken);
  return (payload?.sub as string) ?? null;
}
