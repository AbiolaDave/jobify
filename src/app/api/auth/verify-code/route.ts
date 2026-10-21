import { createHash } from "node:crypto";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import OtpChallenge from "@/models/OtpChallenge";
import User from "@/models/User";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    const input = body as Record<string, unknown>;
    const challengeId = typeof input.challengeId === "string" ? input.challengeId : "";
    const code = typeof input.code === "string" ? input.code : "";
    if (!mongoose.isValidObjectId(challengeId) || !/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: "That code is not valid. Check it and try again." }, { status: 400 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
      throw new Error("JWT_SECRET must be configured with at least 32 characters.");
    }
    await connectToDatabase();
    const challenge = await OtpChallenge.findOneAndUpdate(
      {
        _id: challengeId,
        expiresAt: { $gt: new Date() },
        consumedAt: { $exists: false },
        attempts: { $lt: 5 },
      },
      { $inc: { attempts: 1 } },
      { new: true },
    );
    if (!challenge) {
      return NextResponse.json(
        { error: "This code expired or has reached its attempt limit. Request a new one." },
        { status: 400 },
      );
    }

    const codeHash = createHash("sha256")
      .update(`${secret}:${challengeId}:${code}`)
      .digest("hex");
    if (codeHash !== challenge.codeHash) {
      return NextResponse.json({ error: "That code is not valid. Check it and try again." }, { status: 400 });
    }

    const consumed = await OtpChallenge.findOneAndUpdate(
      { _id: challenge._id, consumedAt: { $exists: false } },
      { $set: { consumedAt: new Date() } },
      { new: true },
    );
    if (!consumed) {
      return NextResponse.json({ error: "This code has already been used." }, { status: 400 });
    }

    let user = await User.findOne({ email: challenge.email });
    if (challenge.purpose === "signup") {
      if (user) {
        return NextResponse.json(
          { error: "An account with this email already exists. Please sign in." },
          { status: 409 },
        );
      }
      user = await User.create({
        email: challenge.email,
        fullName: challenge.fullName ?? "",
        role: challenge.role,
      });
    }
    if (!user) {
      return NextResponse.json({ error: "Account not found. Please create an account." }, { status: 404 });
    }

    await createSession(user);
    return NextResponse.json({
      userId: user._id.toString(),
      role: user.role,
    });
  } catch (error) {
    console.error("Unable to verify authentication code:", error);
    return NextResponse.json(
      { error: "We could not verify your code. Please try again." },
      { status: 500 },
    );
  }
}
