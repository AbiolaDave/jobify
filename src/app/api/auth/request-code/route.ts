import { createHash, randomInt } from "node:crypto";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { sendVerificationCode } from "@/lib/email";
import OtpChallenge from "@/models/OtpChallenge";
import User from "@/models/User";

export const runtime = "nodejs";

function hashCode(challengeId: string, code: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 characters.");
  }
  return createHash("sha256").update(`${secret}:${challengeId}:${code}`).digest("hex");
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    const input = body as Record<string, unknown>;
    const purpose = input.purpose;
    const role = input.role;
    const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
    const fullName = typeof input.fullName === "string" ? input.fullName.trim() : "";

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      (purpose !== "signup" && purpose !== "login") ||
      (role !== "seeker" && role !== "employer") ||
      (purpose === "signup" && (fullName.length < 2 || fullName.length > 100))
    ) {
      return NextResponse.json({ error: "Enter valid account details." }, { status: 400 });
    }

    await connectToDatabase();
    const existingUser = await User.findOne({ email });
    if (purpose === "signup" && existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please sign in." },
        { status: 409 },
      );
    }
    if (purpose === "login" && !existingUser) {
      return NextResponse.json(
        { error: "No account found for this email. Please create an account." },
        { status: 404 },
      );
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentChallenges = await OtpChallenge.countDocuments({
      email,
      createdAt: { $gt: oneHourAgo },
    });
    if (recentChallenges >= 5) {
      return NextResponse.json(
        { error: "Too many verification requests. Please try again later." },
        { status: 429 },
      );
    }
    const recentChallenge = await OtpChallenge.findOne({
      email,
      createdAt: { $gt: new Date(Date.now() - 60 * 1000) },
    }).lean();
    if (recentChallenge) {
      return NextResponse.json(
        { error: "Please wait a minute before requesting another code." },
        { status: 429 },
      );
    }

    await OtpChallenge.deleteMany({ email, consumedAt: { $exists: false } });
    const code = randomInt(0, 1_000_000).toString().padStart(6, "0");
    const challengeId = new mongoose.Types.ObjectId();
    const challenge = new OtpChallenge({
      _id: challengeId,
      email,
      codeHash: hashCode(challengeId.toString(), code),
      purpose,
      role: purpose === "login" && existingUser ? existingUser.role : role,
      ...(purpose === "signup" ? { fullName } : {}),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    await challenge.save();
    await sendVerificationCode(email, code);

    return NextResponse.json({
      challengeId: challenge._id.toString(),
      destination: email,
      expiresInSeconds: 600,
    });
  } catch (error) {
    console.error("Unable to request an authentication code:", error);
    if (error && typeof error === "object" && "code" in error && error.code === 11000) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please sign in." },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "We could not send a verification code. Please try again." },
      { status: 500 },
    );
  }
}
