import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await requireSession();
    return NextResponse.json({ authenticated: Boolean(session), session });
  } catch (error) {
    console.error("Unable to load authentication session:", error);
    return NextResponse.json({ error: "Unable to load session." }, { status: 500 });
  }
}
