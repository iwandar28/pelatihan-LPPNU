import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ownerName, status, farmerGroup, address, areaHectares, commodity, cultivator, inputType, geoJsonData, colorHex, centerLat, centerLng } = body;

    if (!ownerName || !status || !address || !geoJsonData) {
      return NextResponse.json(
        { success: false, message: "Nama pemilik, status, alamat, dan data GeoJSON wajib diisi" },
        { status: 400 }
      );
    }

    const land = await prisma.gisLandMap.create({
      data: {
        ownerName,
        status,
        farmerGroup: farmerGroup || "Kelompok Tani Binaan",
        address,
        areaHectares: parseFloat(areaHectares || "0"),
        commodity: commodity || "Padi / Hortikultura",
        cultivator: cultivator || "-",
        inputType: inputType || "KML_UPLOAD",
        geoJsonData: typeof geoJsonData === "string" ? geoJsonData : JSON.stringify(geoJsonData),
        colorHex: colorHex || "#22c55e",
        centerLat: centerLat ? parseFloat(centerLat) : null,
        centerLng: centerLng ? parseFloat(centerLng) : null,
      },
    });

    return NextResponse.json({
      success: true,
      data: land,
      message: "Data pemetaan lahan GIS berhasil disimpan",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
