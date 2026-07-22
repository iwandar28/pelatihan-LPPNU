import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const stats = await prisma.profileStatistic.findFirst({
      where: { id: 1 },
    });
    const board = await prisma.boardMember.findMany({
      orderBy: { orderIndex: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: {
        stats,
        board,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
