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
  { params }: { params: Promise<{ profileId: string }> },
) {
  try {
    // 1. Await the params promise first
    const { profileId } = await params;

    // 2. Auth check
    const token = req.cookies.get("access_token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload || !payload.sub)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 3. Verify ownership
    const owner = await prisma.user.findFirst({
      where: {
        id: payload.sub as string,
        profileId: profileId,
      },
    });

    if (!owner)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // 4. Parse body and update
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
