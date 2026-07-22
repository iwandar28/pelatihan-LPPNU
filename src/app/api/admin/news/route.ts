import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, imageUrl, author } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: "Judul dan konten berita wajib diisi" },
        { status: 400 }
      );
    }

    const news = await prisma.news.create({
      data: {
        title,
        content,
        imageUrl: imageUrl || null,
        author: author || "Admin LPPNU",
        isPublished: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: news,
      message: "Berita berhasil dipublikasikan",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
