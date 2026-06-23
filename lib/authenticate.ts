import { NextRequest } from "next/server";
import { verifyToken } from "./token";
import { prisma } from "./prisma";

export async function authenticate(req: NextRequest) {
  const token =
    req.headers.get("authorization")?.replace("Bearer ", "") ??
    req.cookies.get("access_token")?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.sub as string },
    select: { id: true, email: true, username: true },
  });

  return user;
}
