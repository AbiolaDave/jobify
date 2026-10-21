import type { EmploymentType, ExperienceLevel } from "@/types/jobs";

export const employmentTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance/Gig",
  "NYSC-friendly",
] as const satisfies readonly EmploymentType[];

export const experienceLevels = [
  "Entry-level",
  "Junior",
  "Mid-level",
] as const satisfies readonly ExperienceLevel[];

export const jobCategories = [
  "Engineering",
  "Design",
  "Marketing",
  "Operations",
  "Customer Success",
  "Finance",
] as const;
