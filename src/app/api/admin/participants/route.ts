import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      fullName, nikOrId, institution, district, village, commodity, 
      membershipStatus, latitude, longitude, address, phone, 
      idCardPhoto, farmerGroup, certificateScan, trainingAttended, 
      trainingDate, bioOrNotes 
    } = body;

    if (!fullName || !district || !village || !commodity || !latitude || !longitude) {
      return NextResponse.json(
        { success: false, message: "Field utama (nama, kecamatan, desa, komoditas, koordinat) wajib diisi" },
        { status: 400 }
      );
    }

    const participant = await prisma.participant.create({
      data: {
        fullName,
        nikOrId: nikOrId || null,
        institution: institution || null,
        district,
        village,
        commodity,
        membershipStatus: membershipStatus || "ACTIVE",
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
      data: participant,
      message: "Data peserta berhasil ditambahkan",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
