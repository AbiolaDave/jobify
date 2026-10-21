"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthRequestForm from "@/app/shared/components/authRequestForm";
import OtpVerificationForm from "@/app/shared/components/otpVerificationForm";
import { login, verifyOtp } from "@/services/api";
import type { UserRole } from "@/types/platform";

type Mode = "login" | "signup";

export default function AuthFlow({
  mode,
  initialRole = "seeker",
}: {
  mode: Mode;
  initialRole?: UserRole;
}) {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [destination, setDestination] = useState("");
  const [fullName, setFullName] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function requestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    const cleanDestination = destination.trim();
    if (mode === "signup" && !fullName.trim()) {
      setError("Enter your name to create an account.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanDestination)) {
      setError("Enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const challenge = await login({
        role,
        purpose: mode,
        ...(mode === "signup" ? { fullName: fullName.trim() } : {}),
        email: cleanDestination,
      });
      setDestination(cleanDestination);
      setChallengeId(challenge.challengeId);
      setMessage(`Verification code sent to ${challenge.destination}.`);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "We could not send a code. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!/^\d{6}$/.test(code)) {
      setError("Enter the 6-digit code.");
      return;
    }

    setIsLoading(true);
    try {
      const session = await verifyOtp({ challengeId, code });
      setMessage(`Signed in as ${session.role === "seeker" ? "Job Seeker" : "Employer"}.`);
      router.replace("/dashboard");
      router.refresh();
    } catch (verificationError) {
      setError(
        verificationError instanceof Error
          ? verificationError.message
          : "We could not verify that code. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function changeNumber() {
    setChallengeId("");
    setCode("");
    setError("");
    setMessage("");
  }

  return (
    <main className="auth-page">
      <section aria-labelledby="auth-title" className="auth-card">
        <Link aria-label="Jobify home" className="auth-brand" href="/">
          Jobify
        </Link>
        <p className="eyebrow">A better start to your career</p>
        <h1 className="section-heading" id="auth-title">
          {mode === "signup" ? "Create your account" : "Welcome back"}
        </h1>
        <p className="muted-copy">
          {mode === "signup"
            ? "Join Jobify to find trusted opportunities or hire early-career talent."
            : "Sign in to continue to your Jobify account."}
        </p>

        {!challengeId ? (
          <AuthRequestForm
            destination={destination}
            fullName={fullName}
            isLoading={isLoading}
            mode={mode}
            onSubmit={requestCode}
            role={role}
            setDestination={setDestination}
            setFullName={setFullName}
            setRole={setRole}
          />
        ) : (
          <OtpVerificationForm
            changeNumber={changeNumber}
            code={code}
            destination={destination}
            isLoading={isLoading}
            onSubmit={verifyCode}
            setCode={setCode}
          />
        )}

        {error && (
          <p aria-live="assertive" className="auth-message auth-message--error" role="alert">
            {error}
          </p>
        )}
        {message && (
          <p aria-live="polite" className="auth-message" role="status">
            {message}
          </p>
        )}

        <p className="auth-switch">
          {mode === "signup" ? "Already have an account?" : "New to Jobify?"}{" "}
          <Link href={mode === "signup" ? "/login" : "/sign-up"}>
            {mode === "signup" ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </section>
    </main>
  );
}
