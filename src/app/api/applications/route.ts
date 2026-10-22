import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import JobApplication from "@/models/JobApplication";
import JobPost from "@/models/JobPost";
import User from "@/models/User";
import { getJob } from "@/services/jobs";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const session = await requireSession();
    if (!session) {
      return NextResponse.json(
        { error: "Sign in to view your applications." },
        { status: 401 },
      );
    }
    await connectToDatabase();
    const jobId = new URL(request.url).searchParams.get("jobId");
    if (jobId) {
      if (session.role !== "employer") {
        return NextResponse.json(
          { error: "Only employers can review applicants." },
          { status: 403 },
        );
      }
      if (!mongoose.isValidObjectId(jobId)) {
        return NextResponse.json({ error: "Job not found." }, { status: 404 });
      }
      const post = await JobPost.findOne({
        _id: jobId,
        employerId: session.userId,
      }).lean();
      if (!post) {
        return NextResponse.json({ error: "Job not found." }, { status: 404 });
      }
      const records = await JobApplication.find({ jobId })
        .sort({ appliedAt: -1 })
        .lean();
      const users = await User.find({
        _id: { $in: records.map((record) => record.userId) },
      })
        .select("fullName")
        .lean();
      const nameById = new Map(
        users.map((user) => [user._id.toString(), user.fullName]),
      );
      return NextResponse.json(
        records.map((application) => ({
          application: {
            id: application._id.toString(),
            jobId: application.jobId,
            jobSlug: application.jobSlug,
            jobTitle: application.jobTitle,
            employerName: application.employerName,
            status: application.status,
            appliedAt: application.appliedAt.toISOString(),
          },
          seeker: {
            id: application.userId.toString(),
            fullName:
              nameById.get(application.userId.toString()) ?? "Job seeker",
            headline: "",
            skills: [],
            education: [],
            experience: [],
          },
        })),
      );
    }
    if (session.role !== "seeker") {
      return NextResponse.json(
        { error: "Only job seekers can view their applications." },
        { status: 403 },
      );
    }
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
    return NextResponse.json(
      { error: "Unable to load applications." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    if (!session) {
      return NextResponse.json(
        {
          error: "Please sign in or create an account before applying.",
          signInRequired: true,
        },
        { status: 401 },
      );
    }
    if (session.role !== "seeker") {
      return NextResponse.json(
        { error: "Only job seeker accounts can apply." },
        { status: 403 },
      );
    }
    const body: unknown = await request.json();
    const input =
      body && typeof body === "object" ? (body as Record<string, unknown>) : {};
    const jobId = typeof input.jobId === "string" ? input.jobId.trim() : "";
    const jobSlug =
      typeof input.jobSlug === "string" ? input.jobSlug.trim() : "";
    const jobTitle =
      typeof input.jobTitle === "string" ? input.jobTitle.trim() : "";
    const employerName =
      typeof input.employerName === "string" ? input.employerName.trim() : "";
    if (
      !jobId ||
      jobId.length > 200 ||
      !jobSlug ||
      jobSlug.length > 200 ||
      !jobTitle ||
      jobTitle.length > 200 ||
      !employerName ||
      employerName.length > 200
    ) {
      return NextResponse.json(
        { error: "A valid job is required." },
        { status: 400 },
      );
    }

    const job = await getJob(jobSlug);
    if (
      !job ||
      job.id !== jobId ||
      job.title !== jobTitle ||
      job.employer.name !== employerName
    ) {
      return NextResponse.json(
        { error: "This job is no longer available." },
        { status: 404 },
      );
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
    return NextResponse.json(
      { error: "Unable to submit application." },
      { status: 500 },
    );
  }
}
