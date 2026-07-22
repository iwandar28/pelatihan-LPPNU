import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { donorName, donorEmail, donorPhone, amount, proofImageUrl } = body;

    if (!donorName || !amount || !proofImageUrl) {
      return NextResponse.json(
        { success: false, message: "Nama, nominal donasi, dan bukti transfer wajib diisi" },
        { status: 400 }
      );
    }

    const transaction = await prisma.donationTransaction.create({
      data: {
        donorName,
        donorEmail: donorEmail || null,
        donorPhone: donorPhone || null,
        amount: parseFloat(amount),
        proofImageUrl,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      data: transaction,
      message: "Donasi berhasil dikirim dan menunggu verifikasi admin",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
