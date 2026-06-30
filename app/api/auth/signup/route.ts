import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signTokens } from "@/lib/jwt";
import { setAuthCookies } from "@/lib/auth-cookies";
import { isValidEmail, isValidUsername, isStrongPassword } from "@/lib/validation";
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

    if (!isValidUsername(username)) {
      return NextResponse.json(
        { message: "Username буруу форматтай байна (3-20 тэмдэгт, үсэг/тоо/_)" },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: "Имэйл хаяг буруу байна" },
        { status: 400 },
      );
    }

    if (!isStrongPassword(password)) {
      return NextResponse.json(
        {
          message:
            "Нууц үг сул байна. 8+ тэмдэгт, том/жижиг үсэг, тоо, тусгай тэмдэгт шаардлагатай",
        },
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
