import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAccessToken } from '@/lib/jwt';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Token олдсонгүй' }, { status: 401 });
    }

    const payload = verifyAccessToken(token);
    if (payload.sub !== params.userId) {
      return NextResponse.json({ message: 'Эрх хүрэхгүй байна' }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id: params.userId },
    });
    if (!user) {
      return NextResponse.json({ message: 'Хэрэглэгч олдсонгүй' }, { status: 404 });
    }

    const { name, about, socialMediaURL, avatarImage, backgroundImage, successMessage } = await req.json();

    const profile = await prisma.profile.update({
      where: { id: user.profileId },
      data: {
        ...(name !== undefined && { name }),
        ...(about !== undefined && { about }),
        ...(socialMediaURL !== undefined && { socialMediaURL }),
        ...(avatarImage !== undefined && { avatarImage }),
        ...(backgroundImage !== undefined && { backgroundImage }),
        ...(successMessage !== undefined && { successMessage }),
      },
    });

    return NextResponse.json({ profile });
  } catch (e) {
    return NextResponse.json({ message: 'Серверийн алдаа' }, { status: 500 });
  }
}