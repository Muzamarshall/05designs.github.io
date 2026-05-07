import { NextRequest, NextResponse } from "next/server";
import { getAllAnalyses } from "@/lib/d1";

export async function GET(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const analyses = await getAllAnalyses();
  return NextResponse.json({ analyses });
}
