import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import JobApplication from "@/models/JobApplication";
import JobPost from "@/models/JobPost";
import type { ApplicationStatus } from "@/types/jobs";

export const runtime = "nodejs";

const employerStatuses: ApplicationStatus[] = [
  "Viewed",
  "Shortlisted",
  "Rejected",
];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ applicationId: string }> },
) {
  try {
    const session = await requireSession();
    if (!session) {
      return NextResponse.json(
        { error: "Sign in to update applications." },
        { status: 401 },
      );
    }
    if (session.role !== "employer") {
      return NextResponse.json(
        { error: "Only employers can update application status." },
        { status: 403 },
      );
    }
    const { applicationId } = await params;
    if (!mongoose.isValidObjectId(applicationId)) {
      return NextResponse.json(
        { error: "Application not found." },
        { status: 404 },
      );
    }
    const body: unknown = await request.json();
    const status =
      body && typeof body === "object" && "status" in body
        ? body.status
        : undefined;
    if (
      typeof status !== "string" ||
      !employerStatuses.includes(status as ApplicationStatus)
    ) {
      return NextResponse.json(
        { error: "Choose a valid application status." },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const application = await JobApplication.findById(applicationId);
    if (!application) {
      return NextResponse.json(
        { error: "Application not found." },
        { status: 404 },
      );
    }
    const job = await JobPost.findOne({
      _id: application.jobId,
      employerId: session.userId,
    });
    if (!job) {
      return NextResponse.json(
        { error: "Application not found." },
        { status: 404 },
      );
    }
    application.status = status as ApplicationStatus;
    await application.save();
    return NextResponse.json({ applicationId, status: application.status });
  } catch (error) {
    console.error("Unable to update application:", error);
    return NextResponse.json(
      { error: "Unable to update this application." },
      { status: 500 },
    );
  }
}
