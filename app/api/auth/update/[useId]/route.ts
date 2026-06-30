import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ useId: string }> },
) {
  try {
    const { useId: userId } = await params;

    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Token олдсонгүй" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || payload.sub !== userId) {
      return NextResponse.json(
        { message: "Эрх хүрэхгүй байна" },
        { status: 403 },
      );
    }

    const {
      username,
      name,
      about,
      socialMediaURL,
      avatarImage,
      backgroundImage,
      successMessage,
    } = await req.json();

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { message: "Хэрэглэгч олдсонгүй" },
        { status: 404 },
      );
    }
    console.log("Received username:", username); 
    console.log("userId:", userId);
    const [updatedUser, profile] = await Promise.all([
      username
        ? prisma.user.update({
            where: { id: userId },
            data: { username },
          })
        : Promise.resolve(user),
      prisma.profile.update({
        where: { id: user.profileId },
        data: {
          ...(name !== undefined && { name }),
          ...(about !== undefined && { about }),
          ...(socialMediaURL !== undefined && { socialMediaURL }),
          ...(avatarImage !== undefined && { avatarImage }),
          ...(backgroundImage !== undefined && { backgroundImage }),
          ...(successMessage !== undefined && { successMessage }),
        },
      }),
    ]);

    return NextResponse.json({ user: updatedUser, profile });
  } catch (e) {
    return NextResponse.json({ message: "Серверийн алдаа" }, { status: 500 });
  }
}
