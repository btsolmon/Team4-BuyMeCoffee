import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { transactionId, paymentType } = await request.json();

  const updatedTransaction = await prisma.transaction.update({
    where: { id: transactionId },
    data: { status: "COMPLETED", paymentType: paymentType ?? "QPAY" },
  });

  return NextResponse.json({ success: true, transaction: updatedTransaction });
}
