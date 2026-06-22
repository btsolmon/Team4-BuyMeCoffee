import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/token"; // ← authenticate → verifyToken
import bcrypt from "bcrypt";

type UpdateUserData = {
  email?: string;
  username?: string;
  password?: string;
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  const token = req.cookies.get("access_token")?.value;
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // өөрийн мэдээллээ л өөрчлөх боломжтой
  if (payload.sub !== params.userId)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body: UpdateUserData = await req.json();
    const data: UpdateUserData = { ...body };
    if (body.password) data.password = await bcrypt.hash(body.password, 10);

    const updated = await prisma.user.update({
      where: { id: params.userId },
      data,
      select: { id: true, email: true, username: true, updatedAt: true },
    });

    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
