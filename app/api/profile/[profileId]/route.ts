import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/authenticate";

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
    const authUser = await authenticate(req);
    if (!authUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const owner = await prisma.user.findFirst({
      where: { id: authUser.id, profileId: params.profileId },
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
