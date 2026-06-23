import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  try {
    const days = req.nextUrl.searchParams.get("days");
    const since = days
      ? new Date(Date.now() - Number(days) * 24 * 60 * 60 * 1000)
      : undefined;

    const result = await prisma.donation.aggregate({
      where: {
        recipientId: params.userId,
        ...(since ? { createdAt: { gte: since } } : {}),
      },
      _sum: { amount: true },
    });

    return NextResponse.json({ total: result._sum.amount ?? 0 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
