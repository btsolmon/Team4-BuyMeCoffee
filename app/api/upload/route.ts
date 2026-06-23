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

    if (!file || !profileId || !field) {
      return NextResponse.json(
        {
          error: "Шаардлагатай мэдээлэл (file, profileId, field) дутуу байна.",
        },
        { status: 400 },
      );
    }

    console.log("Хүсэлт амжилттай ирлээ:", {
      filename: file.name,
      profileId,
      field,
    });

    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
    });

    console.log("Файл Blob руу хуулагдлаа:", blob.url);

    await prisma.profile.update({
      where: { id: profileId },
      data: { [field]: blob.url },
    });

    return NextResponse.json(blob);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error("Серверийн алдаа (Terminal дээр харна уу):", e);

    return NextResponse.json(
      { error: e.message || String(e) },
      { status: 500 },
    );
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
