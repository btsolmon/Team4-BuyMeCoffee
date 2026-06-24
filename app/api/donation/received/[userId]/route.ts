import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;
    const donations = await prisma.donation.findMany({
      where: { recipientId: userId },
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
  } catch (error) {
    // Log the error for debugging
    console.error("Failed to fetch donations:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
