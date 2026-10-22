import mongoose, { type InferSchemaType, type Model } from "mongoose";
import { employmentTypes, experienceLevels } from "@/data/jobOptions";

const jobPostSchema = new mongoose.Schema(
  {
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    employerName: { type: String, required: true, trim: true },
    industry: { type: String, default: "Not specified", trim: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    isRemote: { type: Boolean, default: false },
    type: { type: String, enum: employmentTypes, required: true },
    level: { type: String, enum: experienceLevels, required: true },
    category: { type: String, required: true, trim: true },
    salaryMin: { type: Number, min: 0 },
    salaryMax: { type: Number, min: 0 },
    salaryPeriod: {
      type: String,
      enum: ["monthly", "yearly"],
      default: "monthly",
    },
    summary: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    requirements: { type: [String], default: [] },
    whatsappPhone: { type: String, trim: true },
    postedAt: { type: Date, default: Date.now, index: true },
    status: {
      type: String,
      enum: ["published", "closed"],
      default: "published",
      index: true,
    },
  },
  { timestamps: true },
);

export type JobPostRecord = InferSchemaType<typeof jobPostSchema> & {
  _id: mongoose.Types.ObjectId;
  employerId: mongoose.Types.ObjectId;
};

const JobPost =
  (mongoose.models.JobPost as Model<JobPostRecord> | undefined) ??
  mongoose.model<JobPostRecord>("JobPost", jobPostSchema);

export default JobPost;
