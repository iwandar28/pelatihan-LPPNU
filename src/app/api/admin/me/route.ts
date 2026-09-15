import { NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;

  if (!sessionToken) {
    return NextResponse.json({ success: false, message: "Tidak ada sesi aktif" }, { status: 401 });
  }

  const user = await verifySession(sessionToken);

  if (!user) {
    return NextResponse.json({ success: false, message: "Sesi tidak valid" }, { status: 401 });
  }

  return NextResponse.json({ success: true, data: user });
}
