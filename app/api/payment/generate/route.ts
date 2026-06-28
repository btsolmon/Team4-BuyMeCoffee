import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import QRCode from "qrcode";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Generate request body:", body);

    const { amount } = body;

    const transaction = await prisma.transaction.create({
      data: { amount: Number(amount), status: "PENDING" },
    });

    console.log("Transaction created:", transaction.id);

    const mockPaymentUrl = `${process.env.NEXT_PUBLIC_APP_URL}/pay/${transaction.id}`;
    console.log("Payment URL:", mockPaymentUrl);

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
