import mongoose, { type InferSchemaType, type Model } from "mongoose";
import type { UserRole } from "@/types/platform";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    role: { type: String, enum: ["seeker", "employer"], required: true },
  },
  { timestamps: true },
);

export type UserRecord = InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId;
  role: UserRole;
};

const User =
  (mongoose.models.User as Model<UserRecord> | undefined) ??
  mongoose.model<UserRecord>("User", userSchema);

export default User;
