import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/token";

export async function POST(req: NextRequest) {
  try {
    const { recipientId, amount, specialMessage, socialURLOrBuyMeACoffee } =
      await req.json();

    if (!recipientId || !amount) {
      return NextResponse.json(
        { error: "recipientId and amount are required" },
        { status: 400 },
      );
    }

    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
    });
    if (!recipient) {
      return NextResponse.json(
        { error: "Recipient not found" },
        { status: 404 },
      );
    }

    let donorId: string | null = null;
    const token = req.cookies.get("access_token")?.value;
    if (token) {
      const payload = await verifyToken(token);
      if (payload?.sub) donorId = payload.sub as string;
    }

    const donation = await prisma.donation.create({
      data: {
        recipientId,
        donorId,
        amount: Number(amount),
        specialMessage: specialMessage ?? null,
        socialURLOrBuyMeACoffee: socialURLOrBuyMeACoffee ?? null,
      },
    });

    return NextResponse.json(donation, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
