import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { employmentTypes, experienceLevels } from "@/data/jobOptions";
import { requireSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import JobPost, { type JobPostRecord } from "@/models/JobPost";
import User from "@/models/User";
import type { CreateJobInput } from "@/types/platform";
import type { Job } from "@/types/jobs";

export const runtime = "nodejs";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toJob(post: JobPostRecord, employerName: string): Job {
  return {
    id: post._id.toString(),
    slug: post.slug,
    title: post.title,
    employer: {
      id: post.employerId.toString(),
      name: employerName,
      initials: employerName
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase(),
      industry: post.industry,
      isVerified: false,
      location: `${post.city}, ${post.state}`,
    },
    state: post.state,
    city: post.city,
    isRemote: post.isRemote,
    type: post.type as Job["type"],
    level: post.level as Job["level"],
    category: post.category,
    ...(typeof post.salaryMin === "number"
      ? { salaryMin: post.salaryMin }
      : {}),
    ...(typeof post.salaryMax === "number"
      ? { salaryMax: post.salaryMax }
      : {}),
    salaryPeriod: post.salaryPeriod as Job["salaryPeriod"],
    summary: post.summary,
    description: post.description,
    requirements: post.requirements,
    postedAt: post.postedAt.toISOString().slice(0, 10),
    isFeatured: false,
    ...(post.whatsappPhone ? { whatsappPhone: post.whatsappPhone } : {}),
  };
}

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    if (!session) {
      return NextResponse.json(
        { error: "Sign in with an employer account to post a job." },
        { status: 401 },
      );
    }
    if (session.role !== "employer") {
      return NextResponse.json(
        { error: "Only employer accounts can post jobs." },
        { status: 403 },
      );
    }

    const body: unknown = await request.json();
    if (!isObject(body)) {
      return NextResponse.json(
        { error: "Enter valid job details." },
        { status: 400 },
      );
    }
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const state = typeof body.state === "string" ? body.state.trim() : "";
    const city = typeof body.city === "string" ? body.city.trim() : "";
    const category =
      typeof body.category === "string" ? body.category.trim() : "";
    const summary = typeof body.summary === "string" ? body.summary.trim() : "";
    const description =
      typeof body.description === "string" ? body.description.trim() : "";
    const requirements = Array.isArray(body.requirements)
      ? body.requirements
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];
    const type = body.type;
    const level = body.level;
    const salaryMin =
      typeof body.salaryMin === "number" ? body.salaryMin : undefined;
    const salaryMax =
      typeof body.salaryMax === "number" ? body.salaryMax : undefined;

    if (
      title.length < 2 ||
      title.length > 120 ||
      !state ||
      state.length > 100 ||
      !city ||
      city.length > 100 ||
      !category ||
      category.length > 80 ||
      summary.length < 10 ||
      summary.length > 300 ||
      description.length < 20 ||
      description.length > 10000 ||
      !employmentTypes.includes(type as (typeof employmentTypes)[number]) ||
      !experienceLevels.includes(level as (typeof experienceLevels)[number]) ||
      (salaryMin !== undefined &&
        (!Number.isFinite(salaryMin) || salaryMin < 0)) ||
      (salaryMax !== undefined &&
        (!Number.isFinite(salaryMax) || salaryMax < 0)) ||
      (salaryMin !== undefined &&
        salaryMax !== undefined &&
        salaryMin > salaryMax) ||
      requirements.length > 20 ||
      requirements.some((item) => item.length > 500)
    ) {
      return NextResponse.json(
        { error: "Check the job details and try again." },
        { status: 400 },
      );
    }

    const input: CreateJobInput = {
      title,
      state,
      city,
      isRemote: body.isRemote === true,
      type: type as Job["type"],
      level: level as Job["level"],
      category,
      salaryMin,
      salaryMax,
      salaryPeriod: body.salaryPeriod === "yearly" ? "yearly" : "monthly",
      summary,
      description,
      requirements,
      ...(typeof body.whatsappPhone === "string"
        ? { whatsappPhone: body.whatsappPhone }
        : {}),
    };

    await connectToDatabase();
    const employer = await User.findById(session.userId)
      .select("fullName")
      .lean();
    if (!employer) {
      return NextResponse.json(
        { error: "Employer account not found." },
        { status: 404 },
      );
    }
    const employerName = employer.fullName;
    const postId = new mongoose.Types.ObjectId();
    const post = await JobPost.create({
      ...input,
      _id: postId,
      employerId: new mongoose.Types.ObjectId(session.userId),
      employerName,
      slug: `${slugify(title)}-${slugify(employerName)}-${postId.toString().slice(-6)}`,
      status: "published",
    });
    return NextResponse.json(toJob(post, employerName), { status: 201 });
  } catch (error) {
    console.error("Unable to post job:", error);
    return NextResponse.json(
      { error: "Unable to post this job." },
      { status: 500 },
    );
  }
}
