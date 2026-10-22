import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import JobPost from "@/models/JobPost";
import { getJobs } from "@/services/jobs";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await requireSession();
    if (!session) {
      return NextResponse.json(
        { error: "Sign in to view your job posts." },
        { status: 401 },
      );
    }
    if (session.role !== "employer") {
      return NextResponse.json(
        { error: "Only employer accounts can view job posts." },
        { status: 403 },
      );
    }
    await connectToDatabase();
    const posts = await JobPost.find({ employerId: session.userId })
      .sort({ postedAt: -1 })
      .lean();
    const jobs = await getJobs({ pageSize: Number.MAX_SAFE_INTEGER });
    const jobById = new Map(jobs.jobs.map((job) => [job.id, job]));
    return NextResponse.json(
      posts.map((post) => jobById.get(post._id.toString())).filter(Boolean),
    );
  } catch (error) {
    console.error("Unable to load employer jobs:", error);
    return NextResponse.json(
      { error: "Unable to load your job posts." },
      { status: 500 },
    );
  }
}
