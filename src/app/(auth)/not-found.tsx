import StatusPage from "@/app/shared/components/statusPage";

export default function NotFound() {
  return (
    <StatusPage
      description="The page you’re looking for isn’t available."
      href="/"
      title="We couldn’t find that page."
      action="Go to Jobify"
    />
  );
}
