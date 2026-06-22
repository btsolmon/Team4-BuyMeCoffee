import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/authenticate";

export async function GET(req: NextRequest) {
  try {
    const authUser = await authenticate(req);
    if (!authUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true,
        profile: true,
        bankCard: {
          select: {
            id: true,
            country: true,
            firstName: true,
            lastName: true,
            expiryDate: true,
          },
        },
        receivedDonations: {
          select: {
            id: true,
            amount: true,
            specialMessage: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
