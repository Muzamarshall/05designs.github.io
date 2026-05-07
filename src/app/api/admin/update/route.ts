import { NextRequest, NextResponse } from "next/server";
import { updateFollowUpEdited } from "@/lib/d1";

export async function POST(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { token, followUpEdited } = await req.json();
  if (!token || !followUpEdited) {
    return NextResponse.json({ error: "token and followUpEdited required" }, { status: 400 });
  }

  await updateFollowUpEdited(token, followUpEdited);
  return NextResponse.json({ success: true });
}
