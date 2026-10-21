import AuthFlow from "@/app/shared/components/authFlow";
import type { UserRole } from "@/types/platform";

type SearchParams = Promise<{ role?: string }>;

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const initialRole: UserRole =
    params.role === "employer" ? "employer" : "seeker";

  return <AuthFlow initialRole={initialRole} mode="signup" />;
}
