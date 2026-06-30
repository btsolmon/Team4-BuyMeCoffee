import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";
import { del } from "@vercel/blob";
import { NextResponse } from "next/server";
export async function PUT(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file") as File;
    const profileId = form.get("profileId") as string;
    const field = form.get("field") as string;

    console.log({ file, profileId, field });

    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
    });

    console.log({ blob });

    await prisma.profile.update({
      where: { id: profileId },
      data: { [field]: blob.url },
    });

    return NextResponse.json(blob);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const urlToDelete = searchParams.get("url") as string;
  const profileId = searchParams.get("profileId") as string;

  await del(urlToDelete);

  await prisma.profile.update({
    where: { id: profileId },
    data: { backgroundImage: null },
  });

  return new Response();
}
