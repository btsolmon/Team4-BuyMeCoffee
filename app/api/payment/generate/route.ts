import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import QRCode from "qrcode";

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    const { amount, recipientId, specialMessage, socialURLOrBuyMeACoffee } =
      await request.json();

    const transaction = await prisma.transaction.create({
      data: {
        amount: Number(amount),
        status: "PENDING",
        recipientId: recipientId ?? null,
        donorId: currentUser?.id ?? null,
        specialMessage: specialMessage ?? null,
        socialURLOrBuyMeACoffee: socialURLOrBuyMeACoffee ?? null,
      },
    });

    const mockPaymentUrl = `https://c3bjc0l1-3000.jpe1.devtunnels.ms/pay/${transaction.id}`;
    const qrCodeUrl = await QRCode.toDataURL(mockPaymentUrl);

    return NextResponse.json({
      transactionId: transaction.id,
      qrCodeUrl,
      mockPaymentUrl,
    });
  } catch (error) {
    console.error("Generate route error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
