import { NextRequest, NextResponse } from "next/server";
import { verifyToken, generateToken } from "@/lib/token";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json({ error: "No token" }, { status: 401 });

    const payload = await verifyToken(token, true);
    if (!payload || !payload.sub)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

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

    return NextResponse.json({ accessToken, refreshToken });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
