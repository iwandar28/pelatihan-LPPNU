import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { uuid: string } }
) {
  try {
    const article = await prisma.news.findFirst({
      where: {
        OR: [{ uuid: params.uuid }, { id: params.uuid }],
        isPublished: true,
      },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, message: "Berita tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: article,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
