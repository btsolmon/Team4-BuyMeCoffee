import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

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
  { params }: { params: Promise<{ profileId: string }> },
) {
  try {
    const { profileId } = await params;

    const token = req.cookies.get("access_token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload || !payload.sub)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const owner = await prisma.user.findFirst({
      where: {
        id: payload.sub as string,
        profileId: profileId,
      },
    });

    if (!owner)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body: UpdateProfileData = await req.json();

    const updated = await prisma.profile.update({
      where: { id: profileId },
      data: { ...body },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
