import ApplicantsPanel from "@/app/shared/components/applicantsPanel";

export default async function ApplicantsPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  return <ApplicantsPanel jobId={jobId} />;
}
