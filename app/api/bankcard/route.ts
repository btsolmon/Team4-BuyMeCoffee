import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bankCard = await prisma.bankCard.findUnique({
      where: { userId },
    });

    return NextResponse.json(bankCard);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { country, firstName, lastName, cardNumber, expiryDate } =
      await req.json();

    if (!country || !firstName || !lastName || !cardNumber || !expiryDate) {
      return NextResponse.json(
        { error: "Бүх талбарыг бөглөнө үү" },
        { status: 400 },
      );
    }

    const parsedExpiry = new Date(expiryDate);
    if (isNaN(parsedExpiry.getTime())) {
      return NextResponse.json(
        { error: "Хүчинтэй огноо оруулна уу" },
        { status: 400 },
      );
    }

    const bankCard = await prisma.bankCard.upsert({
      where: { userId },
      update: {
        country,
        firstName,
        lastName,
        cardNumber,
        expiryDate: parsedExpiry,
      },
      create: {
        userId,
        country,
        firstName,
        lastName,
        cardNumber,
        expiryDate: parsedExpiry,
      },
    });

    return NextResponse.json(bankCard);
  } catch (error) {
    console.error("BankCard save error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
