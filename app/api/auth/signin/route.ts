import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signTokens } from "@/lib/jwt";
import { setAuthCookies } from "@/lib/auth-cookies";
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

    console.log(email, password, "USER PASS AND MAIL");

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        profile: true,
      },
    });
    console.log(user, "USER FROM PRISMA");

    if (!user) {
      return NextResponse.json(
        { message: "Email эсвэл нууц үг буруу" },
        { status: 401 },
      );
    }
    if (!user?.password) {
      return NextResponse.json(
        { message: "User data corrupted" },
        { status: 500 },
      );
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { message: "Email эсвэл нууц үг буруу" },
        { status: 401 },
      );
    }
    console.log(valid, "IS VALID");

    const tokens = signTokens(user.id);

    if (!tokens?.accessToken || !tokens?.refreshToken) {
      return NextResponse.json(
        { message: "Token generation failed" },
        { status: 500 },
      );
    }
    console.log(tokens, "TOKEN");

    const { password: _, ...safeUser } = user;

    const response = NextResponse.json({ user: safeUser });
    console.log(response, "RESPONSE FROM NEXTRESP");

    setAuthCookies(response, tokens.accessToken, tokens.refreshToken);
    return response;
  } catch (e) {
    console.error("LOGIN ERROR:", e);

    return NextResponse.json({ message: "Серверийн алдаа" }, { status: 500 });
  }
}
