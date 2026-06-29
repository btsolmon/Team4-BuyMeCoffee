import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { transactionId, paymentType } = await request.json();

  const updatedTransaction = await prisma.transaction.update({
    where: { id: transactionId },
    data: { status: "COMPLETED", paymentType: paymentType ?? "QPAY" },
  });

  if (updatedTransaction.recipientId) {
    await prisma.donation.create({
      data: {
        amount: updatedTransaction.amount,
        recipientId: updatedTransaction.recipientId,
        donorId: updatedTransaction.donorId ?? null,
        specialMessage: updatedTransaction.specialMessage ?? null,
      },
    });
  }
  return NextResponse.json({ success: true, transaction: updatedTransaction });
}
