import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/authenticate";
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
  const authUser = await authenticate(req);
  if (!authUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
