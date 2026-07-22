import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MembershipStatus } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const district = searchParams.get("district");
    const commodity = searchParams.get("commodity");
    const status = searchParams.get("status");

    const whereClause: any = {};

    if (district && district !== "ALL") {
      whereClause.district = district;
    }
    if (commodity && commodity !== "ALL") {
      whereClause.commodity = {
        contains: commodity,
      };
    }
    if (status && status !== "ALL") {
      whereClause.membershipStatus = status as MembershipStatus;
    }

    const participants = await prisma.participant.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    // Extract list of unique districts and commodities for frontend filter options
    const allParticipants = await prisma.participant.findMany({
      select: { district: true, commodity: true },
    });

    const districts = Array.from(new Set(allParticipants.map((p) => p.district)));
    const commodities = Array.from(new Set(allParticipants.map((p) => p.commodity)));

    return NextResponse.json({
      success: true,
      data: participants,
      filters: {
        districts,
        commodities,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
