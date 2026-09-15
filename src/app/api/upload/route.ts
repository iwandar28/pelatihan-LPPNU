import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename to prevent collisions
    const extension = file.name.split(".").pop();
    const uniqueFilename = `${crypto.randomUUID()}.${extension}`;
    
    // Save to public/uploads directory
    const uploadDir = join(process.cwd(), "public", "uploads");
    const filePath = join(uploadDir, uniqueFilename);
    
    await writeFile(filePath, buffer);

    // Return the URL path
    const url = `/uploads/${uniqueFilename}`;

    return NextResponse.json({
      success: true,
      url,
      message: "File uploaded successfully",
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to upload file" },
      { status: 500 }
    );
  }
}
