import mongoose, { type InferSchemaType, type Model } from "mongoose";

const otpChallengeSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    codeHash: { type: String, required: true },
    purpose: { type: String, enum: ["signup", "login"], required: true },
    role: { type: String, enum: ["seeker", "employer"], required: true },
    fullName: { type: String },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    attempts: { type: Number, default: 0 },
    consumedAt: { type: Date },
  },
  { timestamps: true },
);

export type OtpChallengeRecord = InferSchemaType<typeof otpChallengeSchema> & {
  _id: mongoose.Types.ObjectId;
};

const OtpChallenge =
  (mongoose.models.OtpChallenge as Model<OtpChallengeRecord> | undefined) ??
  mongoose.model<OtpChallengeRecord>("OtpChallenge", otpChallengeSchema);

export default OtpChallenge;
