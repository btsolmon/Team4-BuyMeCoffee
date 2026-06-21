import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/token";

type UpdateProfileData = {
  name?: string;
  about?: string;
  avatarImage?: string;
  socialMediaURL?: string;
  backgroundImage?: string;
  successMessage?: string;
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: { profileId: string } },
) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const owner = await prisma.user.findFirst({
      where: { id: payload.sub as string, profileId: params.profileId },
    });
    if (!owner)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body: UpdateProfileData = await req.json();

    const updated = await prisma.profile.update({
      where: { id: params.profileId },
      data: { ...body },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
