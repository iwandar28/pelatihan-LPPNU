import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { fullName, nikOrId, district, village, commodity, membershipStatus, latitude, longitude, address, bioOrNotes } = body;

    const updated = await prisma.participant.update({
      where: { id: params.id },
      data: {
        fullName,
        nikOrId: nikOrId || null,
        district,
        village,
        commodity,
        membershipStatus,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address: address || null,
        bioOrNotes: bioOrNotes || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Data peserta berhasil diperbarui",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.participant.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Data peserta berhasil dihapus",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
