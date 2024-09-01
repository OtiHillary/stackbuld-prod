import { NextRequest, NextResponse } from "next/server";
import { uploadToGoogleDrive } from "@/lib/goggleDrive"

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("image") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Uploading the file to Google Drive
  const fileId = await uploadToGoogleDrive(file.name, buffer);
  return NextResponse.json({ message: "File uploaded successfully", image: `https://drive.google.com/file/d/${fileId}/view` });


}
