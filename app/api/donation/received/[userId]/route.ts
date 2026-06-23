import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: { userId: string } },
) {
  try {
    const donations = await prisma.donation.findMany({
      where: { recipientId: params.userId },
      select: {
        id: true,
        amount: true,
        specialMessage: true,
        socialURLOrBuyMeACoffee: true,
        donorId: true,
        recipientId: true,
        createdAt: true,
        donor: {
          select: {
            username: true,
            profile: { select: { avatarImage: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(donations);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
