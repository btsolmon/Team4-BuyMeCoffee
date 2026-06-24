import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signTokens } from "@/lib/jwt";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { name, username, email, password } = await req.json();

    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { message: "Бүх талбарыг бөглөнө үү" },
        { status: 400 },
      );
    }

    const exists = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (exists) {
      return NextResponse.json(
        { message: "Email эсвэл username аль хэдийн бүртгэгдсэн" },
        { status: 409 },
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashed,
        profile: { create: { name } },
      },
      include: { profile: true },
    });

    const tokens = signTokens(user.id);
    const { password: _, ...safeUser } = user;

    return NextResponse.json({ ...tokens, user: safeUser }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ message: "Серверийн алдаа" }, { status: 500 });
  }
}
