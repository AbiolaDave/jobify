import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import JobApplication from "@/models/JobApplication";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await requireSession();
    if (!session) {
      return NextResponse.json({ error: "Sign in to view your applications." }, { status: 401 });
    }
    await connectToDatabase();
    const applications = await JobApplication.find({ userId: session.userId })
      .sort({ appliedAt: -1 })
      .lean();
    return NextResponse.json(
      applications.map((application) => ({
        id: application._id.toString(),
        jobId: application.jobId,
        jobSlug: application.jobSlug,
        jobTitle: application.jobTitle,
        employerName: application.employerName,
        status: application.status,
        appliedAt: application.appliedAt.toISOString(),
      })),
    );
  } catch (error) {
    console.error("Unable to load applications:", error);
    return NextResponse.json({ error: "Unable to load applications." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    if (!session) {
      return NextResponse.json(
        { error: "Please sign in or create an account before applying.", signInRequired: true },
        { status: 401 },
      );
    }
    if (session.role !== "seeker") {
      return NextResponse.json({ error: "Only job seeker accounts can apply." }, { status: 403 });
    }
    const body: unknown = await request.json();
    const input = body && typeof body === "object" ? body as Record<string, unknown> : {};
    const jobId = typeof input.jobId === "string" ? input.jobId.trim() : "";
    const jobSlug = typeof input.jobSlug === "string" ? input.jobSlug.trim() : "";
    const jobTitle = typeof input.jobTitle === "string" ? input.jobTitle.trim() : "";
    const employerName = typeof input.employerName === "string" ? input.employerName.trim() : "";
    if (
      !jobId || jobId.length > 200 ||
      !jobSlug || jobSlug.length > 200 ||
      !jobTitle || jobTitle.length > 200 ||
      !employerName || employerName.length > 200
    ) {
      return NextResponse.json({ error: "A valid job is required." }, { status: 400 });
    }

    await connectToDatabase();
    const application = await JobApplication.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(session.userId), jobId },
      {
        $setOnInsert: {
          jobSlug,
          jobTitle,
          employerName,
          status: "Applied",
          appliedAt: new Date(),
        },
      },
      { upsert: true, new: true, runValidators: true },
    );
    return NextResponse.json({
      id: application._id.toString(),
      jobId: application.jobId,
      jobSlug: application.jobSlug,
      jobTitle: application.jobTitle,
      employerName: application.employerName,
      status: application.status,
      appliedAt: application.appliedAt.toISOString(),
    });
  } catch (error) {
    console.error("Unable to apply for job:", error);
    return NextResponse.json({ error: "Unable to submit application." }, { status: 500 });
  }
}
