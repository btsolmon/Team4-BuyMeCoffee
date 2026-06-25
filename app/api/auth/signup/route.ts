import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signTokens } from "@/lib/jwt";
import { setAuthCookies } from "@/lib/auth-cookies";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { name, username, email, password } = await req.json();
    const displayName = name || username;

    if (!username || !email || !password) {
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
        profile: { create: { name: displayName } },
      },
      include: { profile: true },
    });

    const tokens = signTokens(user.id);
    const { password: _, ...safeUser } = user;

    const response = NextResponse.json({ user: safeUser }, { status: 201 });
    setAuthCookies(response, tokens.accessToken, tokens.refreshToken);
    return response;
  } catch (e) {
    return NextResponse.json({ message: "Серверийн алдаа" }, { status: 500 });
  }
}
