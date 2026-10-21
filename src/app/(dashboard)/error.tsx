"use client";

import ErrorFallback from "@/app/shared/components/errorFallback";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorFallback reset={reset} />;
}
