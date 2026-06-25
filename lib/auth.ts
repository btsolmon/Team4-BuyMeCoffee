import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

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
