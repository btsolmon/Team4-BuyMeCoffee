import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const profiles = await prisma.user.findMany({
      where: { profileId: { not: undefined } },
      select: {
        id: true,
        username: true,
        profile: {
          select: {
            id: true,
            name: true,
            about: true,
            avatarImage: true,
            backgroundImage: true,
          },
        },
        _count: { select: { receivedDonations: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(profiles);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
