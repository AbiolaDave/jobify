"use client";

export default function ErrorFallback({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <main className="page-shell status-page" role="alert">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="section-heading">We couldn’t load this page.</h1>
      <p className="muted-copy">
        Check your connection. If you just submitted information, check its
        status before trying again.
      </p>
      <button className="button-primary" onClick={reset} type="button">
        Try again
      </button>
    </main>
  );
}
