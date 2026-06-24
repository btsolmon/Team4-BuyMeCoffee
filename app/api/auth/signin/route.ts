import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signTokens } from "@/lib/jwt";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email болон нууц үгээ оруулна уу" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
    if (!user) {
      return NextResponse.json(
        { message: "Email эсвэл нууц үг буруу" },
        { status: 401 },
      );
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { message: "Email эсвэл нууц үг буруу" },
        { status: 401 },
      );
    }

    const tokens = signTokens(user.id);
    const { password: _, ...safeUser } = user;

    return NextResponse.json({ ...tokens, user: safeUser });
  } catch (e) {
    return NextResponse.json({ message: "Серверийн алдаа" }, { status: 500 });
  }
}
