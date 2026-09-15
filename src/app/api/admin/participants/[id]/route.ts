import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { 
      fullName, nikOrId, institution, district, village, commodity, 
      membershipStatus, latitude, longitude, address, phone, 
      idCardPhoto, farmerGroup, certificateScan, trainingAttended, 
      trainingDate, bioOrNotes 
    } = body;

    const updated = await prisma.participant.update({
      where: { id: params.id },
      data: {
        fullName,
        nikOrId: nikOrId || null,
        institution: institution || null,
        district,
        village,
        commodity,
        membershipStatus,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address: address || null,
        phone: phone || null,
        idCardPhoto: idCardPhoto || null,
        farmerGroup: farmerGroup || null,
        certificateScan: certificateScan || null,
        trainingAttended: trainingAttended || null,
        trainingDate: trainingDate ? new Date(trainingDate) : null,
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
