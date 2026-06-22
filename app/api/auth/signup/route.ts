import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/token";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { email, password, username } = await req.json();

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Email or username already in use" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const profile = await prisma.profile.create({
      data: { name: username },
    });

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        profileId: profile.id,
      },
      select: { id: true, email: true, username: true, createdAt: true },
    });

    const accessToken = await generateToken(user.id, user.email, "15m");
    const refreshToken = await generateToken(user.id, user.email, "7d", true);

    return NextResponse.json(
      { user, accessToken, refreshToken },
      { status: 201 },
    );
  } catch (e) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
