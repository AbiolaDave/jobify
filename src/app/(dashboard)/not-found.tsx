import StatusPage from "@/app/shared/components/statusPage";

export default function NotFound() {
  return (
    <StatusPage
      description="The page you’re looking for isn’t available in your dashboard."
      href="/dashboard"
      title="We couldn’t find that page."
      action="Back to dashboard"
    />
  );
}
