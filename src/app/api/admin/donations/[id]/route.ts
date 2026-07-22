import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DonationStatus } from "@prisma/client";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status, adminNotes } = await request.json();

    if (!status || !["APPROVED", "REJECTED", "PENDING"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Status tidak valid" },
        { status: 400 }
      );
    }

    const updated = await prisma.donationTransaction.update({
      where: { id: params.id },
      data: {
        status: status as DonationStatus,
        adminNotes: adminNotes || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: `Status donasi berhasil diubah menjadi ${status}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
