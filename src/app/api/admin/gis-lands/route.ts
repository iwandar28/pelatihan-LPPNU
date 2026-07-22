import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, farmerGroup, district, village, areaHectares, commodity, inputType, geoJsonData, colorHex, centerLat, centerLng } = body;

    if (!title || !district || !village || !geoJsonData) {
      return NextResponse.json(
        { success: false, message: "Judul, kecamatan, desa, dan data GeoJSON wajib diisi" },
        { status: 400 }
      );
    }

    const land = await prisma.gisLandMap.create({
      data: {
        title,
        farmerGroup: farmerGroup || "Kelompok Tani Binaan",
        district,
        village,
        areaHectares: parseFloat(areaHectares || "0"),
        commodity: commodity || "Padi / Hortikultura",
        inputType: inputType || "MANUAL_POLYGON",
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
