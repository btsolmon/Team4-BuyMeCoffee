import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;
    const days = req.nextUrl.searchParams.get("days");

    // Calculate the 'since' date if 'days' is provided and valid
    const since =
      days && !isNaN(Number(days))
        ? new Date(Date.now() - Number(days) * 24 * 60 * 60 * 1000)
        : undefined;

    const result = await prisma.donation.aggregate({
      where: {
        recipientId: userId,
        ...(since ? { createdAt: { gte: since } } : {}),
      },
      _sum: { amount: true },
    });

    return NextResponse.json({ total: result._sum.amount ?? 0 });
  } catch (error) {
    console.error("Aggregation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
