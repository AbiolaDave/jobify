# Jobify API contract (frontend preview)

The frontend currently uses the mock adapter in `src/services/api.ts`, backed
by `src/services/mockJobs.ts`. Implement the routes below on the backend, then
replace the adapter internals without changing page/component imports.

All JSON responses use UTF-8. Monetary values are integer Naira amounts, not
kobo. Phone numbers use E.164 format (`+234...`). Authenticated endpoints
require `Authorization: Bearer <accessToken>`.

## Common types

```ts
type UserRole = "seeker" | "employer";
type EmploymentType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Internship"
  | "Freelance/Gig"
  | "NYSC-friendly";
type ExperienceLevel = "Entry-level" | "Junior" | "Mid-level";
type ApplicationStatus = "Applied" | "Viewed" | "Shortlisted" | "Rejected";

interface Employer {
  id: string;
  name: string;
  initials: string;
  industry: string;
  isVerified: boolean;
  location: string;
}

interface Job {
  id: string;
  slug: string;
  title: string;
  employer: Employer;
  state: string;
  city: string;
  isRemote: boolean;
  type: EmploymentType;
  level: ExperienceLevel;
  category: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryPeriod?: "monthly" | "yearly";
  summary: string;
  description: string;
  requirements: string[];
  postedAt: string;
  isFeatured: boolean;
  whatsappPhone?: string;
}

interface Page<T> {
  jobs: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

## Public jobs

### `GET /api/jobs`

Query parameters: `query`, `state`, `remote`, `type`, `level`, `category`,
`minSalary`, `maxSalary`, `sort` (`newest` or `salary`), `page`, `pageSize`.
Return `Page<Job>`. `state` is a Nigerian state or `Remote`; remote-only can
also be requested with `remote=true`.

### `GET /api/jobs/{slug}`

Return a `Job`, including employer verification, requirements, and optional
WhatsApp contact, or `404`.

### `POST /api/jobs/{jobId}/applications`

Requires a seeker session. Request:

```json
{ "coverNote": "Optional short note" }
```

Return `201` with:

```json
{
  "id": "application-id",
  "jobId": "job-id",
  "jobSlug": "junior-product-designer",
  "jobTitle": "Junior Product Designer",
  "employerName": "Example employer",
  "status": "Applied",
  "appliedAt": "2026-10-20T08:00:00.000Z"
}
```

The frontend must not treat the WhatsApp link as an application record.

### `POST /api/jobs/{jobId}/reports`

Request:

```json
{
  "reason": "scam",
  "details": "Optional reporter notes"
}
```

`reason` is `scam`, `incorrect`, `discrimination`, or `other`. Return `201`
with `{ "reportId": "report-id", "received": true }`.

## Authentication

### `POST /api/auth/otp/request`

Request: `{ "role": "seeker", "phone": "+2348012345678" }` or
`{ "role": "employer", "email": "name@example.ng" }`. Signup also supplies
`fullName`; login omits it.
Phone OTP is the primary flow; email OTP is an optional alternative. Return:

```json
{
  "challengeId": "opaque-server-generated-id",
  "destination": "+2348012345678",
  "expiresInSeconds": 300
}
```

### `POST /api/auth/otp/verify`

Request: `{ "challengeId": "opaque-server-generated-id", "code": "123456" }`.
Return `{ "accessToken": "...", "userId": "...", "role": "seeker" }`.
The mock adapter accepts `123456` only for local preview; this code and the
mock token must never be used in production.

## Job seeker

### `GET /api/seeker/profile`

Return the signed-in seeker's profile:

```ts
interface Seeker {
  id: string;
  fullName: string;
  headline: string;
  phone: string;
  email?: string;
  skills: string[];
  education: Array<{ institution: string; qualification: string; year?: number }>;
  experience: Array<{
    organisation: string;
    title: string;
    description?: string;
  }>;
  portfolioLinks: string[];
  cvUrl?: string;
  profileCompleteness: number;
}
```

### `PATCH /api/seeker/profile`

Accept the same profile shape with only changed fields. Return the updated
profile and calculate `profileCompleteness` on the server.

### `POST /api/seeker/profile/cv`

Authenticated `multipart/form-data`, field `file`. Accept PDF/DOCX only,
enforce a backend file-size limit, scan uploads, and return `{ "cvUrl": "..." }`.

### `GET /api/seeker/applications`

Return `{ "applications": JobApplication[] }`, where each application contains
`id`, `jobId`, `jobTitle`, `employerName`, `status`, and ISO `appliedAt`.

### `GET /api/seeker/saved-jobs`

Return `{ "jobs": Job[] }`.

### `GET /api/seeker/settings` and `PATCH /api/seeker/settings`

Read/update `{ "jobAlerts": true, "applicationUpdates": true, "marketingEmails": false }`.
Return the updated settings object. Treat marketing email consent separately from
essential application updates.

### `PUT /api/seeker/saved-jobs/{jobId}` and `DELETE /api/seeker/saved-jobs/{jobId}`

Save/unsave a job. Return `{ "jobId": "job-id", "isSaved": true }` or
`{ "jobId": "job-id", "isSaved": false }`.

## Employer

### `POST /api/employer/jobs`

Request uses the job fields supplied by the post-a-job form: `title`, `state`,
`city`, `isRemote`, `type`, `level`, `category`, optional salary range and
period, `summary`, `description`, `requirements`, and optional
`whatsappPhone`. The server assigns `id`, `slug`, `employer`, `postedAt`, and
verification status. Return the created `Job`.

### `GET /api/employer/jobs`

Return `{ "jobs": Job[] }` for the authenticated employer only.

### `GET /api/employer/jobs/{jobId}/applications`

Return `{ "applicants": Applicant[] }` for a job owned by the employer:

```ts
interface Applicant {
  application: JobApplication;
  seeker: Pick<
    Seeker,
    "id" | "fullName" | "headline" | "skills" | "education" | "experience" | "cvUrl"
  >;
}
```

### `PATCH /api/applications/{applicationId}/status`

Request: `{ "status": "Shortlisted" }`. Allowed employer transitions are
`Viewed`, `Shortlisted`, and `Rejected`. Return the updated application.

## Errors and security expectations

Errors should return a non-2xx status and a useful, non-sensitive message:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Check the submitted fields." } }
```

Validate and authorize every write on the server; never trust a client-supplied
employer ID, verification badge, application status, file URL, or role. Rate
limit OTP requests and verification attempts, expire and single-use OTP
challenges, and avoid exposing private candidate data to other applicants.
