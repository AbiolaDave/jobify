import mongoose, { type InferSchemaType, type Model } from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    jobId: { type: String, required: true },
    jobSlug: { type: String, required: true },
    jobTitle: { type: String, required: true },
    employerName: { type: String, required: true },
    status: {
      type: String,
      enum: ["Applied", "Viewed", "Shortlisted", "Rejected"],
      default: "Applied",
    },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

applicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

export type JobApplicationRecord = InferSchemaType<typeof applicationSchema> & {
  _id: mongoose.Types.ObjectId;
};

const JobApplication =
  (mongoose.models.JobApplication as Model<JobApplicationRecord> | undefined) ??
  mongoose.model<JobApplicationRecord>("JobApplication", applicationSchema);

export default JobApplication;
