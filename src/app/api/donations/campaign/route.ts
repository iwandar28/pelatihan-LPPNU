import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const campaign = await prisma.donationCampaign.findFirst({
      where: { id: 1 },
    });

    const approvedTransactions = await prisma.donationTransaction.aggregate({
      where: { status: "APPROVED" },
      _sum: {
        amount: true,
      },
    });

    const totalCollected = approvedTransactions._sum.amount ? Number(approvedTransactions._sum.amount) : 0;

    return NextResponse.json({
      success: true,
      data: {
        campaign,
        totalCollected,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
