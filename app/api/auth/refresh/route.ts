import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyRefreshToken, signTokens } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Token олдсонгүй' }, { status: 401 });
    }

    const payload = verifyRefreshToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      return NextResponse.json({ message: 'Хэрэглэгч олдсонгүй' }, { status: 401 });
    }

    const tokens = signTokens(user.id);
    return NextResponse.json(tokens);
  } catch (e) {
    return NextResponse.json({ message: 'Refresh token хүчингүй байна' }, { status: 401 });
  }
}