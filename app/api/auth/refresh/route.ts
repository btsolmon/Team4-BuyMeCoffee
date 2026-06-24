import { NextRequest, NextResponse } from "next/server";
import { verifyToken, generateToken } from "@/lib/token";

export async function GET(req: NextRequest) {
  try {
    // ✅ cookie-оос уншина
    const token = req.cookies.get("refresh_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    const payload = await verifyToken(token, true);

    if (!payload || !payload.sub) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const accessToken = await generateToken(
      payload.sub,
      payload.email as string,
      "15m",
    );

    const refreshToken = await generateToken(
      payload.sub,
      payload.email as string,
      "7d",
      true,
    );

    const res = NextResponse.json({
      accessToken,
    });

    res.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 15,
      path: "/",
    });

    res.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return res;
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
