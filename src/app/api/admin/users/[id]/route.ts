import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { cookies } from "next/headers";

async function checkAuth() {
  const sessionToken = cookies().get("admin_session")?.value;
  if (!sessionToken) return false;
  const user = await verifySession(sessionToken);
  return !!user;
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  if (!(await checkAuth())) return NextResponse.json({ success: false }, { status: 401 });

  try {
    const userCount = await prisma.user.count();
    if (userCount <= 1) {
      return NextResponse.json({ success: false, message: "Tidak dapat menghapus admin satu-satunya." }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: "Admin dihapus" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
