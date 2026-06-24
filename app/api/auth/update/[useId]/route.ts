import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/token";
import bcrypt from "bcrypt";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  try {
    const token = req.cookies.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);

    if (!payload || payload.sub !== params.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = {};

    if (body.email) {
      data.email = body.email.trim().toLowerCase();
    }

    if (body.username) {
      data.username = body.username;
    }

    if (body.password) {
      data.password = await bcrypt.hash(body.password, 10);
    }

    const updated = await prisma.user.update({
      where: { id: params.userId },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
