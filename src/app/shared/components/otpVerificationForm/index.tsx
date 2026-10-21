import type { FormEvent } from "react";

interface Props {
  destination: string;
  code: string;
  setCode: (code: string) => void;
  isLoading: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  changeNumber: () => void;
}

export default function OtpVerificationForm({
  destination,
  code,
  setCode,
  isLoading,
  onSubmit,
  changeNumber,
}: Props) {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <p className="muted-copy">
        Enter the 6-digit code sent to <strong>{destination}</strong>.
      </p>
      <div className="filter-group">
        <label htmlFor="otp-code">Verification code</label>
        <input
          autoComplete="one-time-code"
          className="filter-control otp-input"
          id="otp-code"
          inputMode="numeric"
          maxLength={6}
          onChange={(event) =>
            setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
          }
          pattern="\d{6}"
          required
          value={code}
        />
      </div>
      <button className="button-primary auth-submit" disabled={isLoading} type="submit">
        {isLoading ? "Verifying…" : "Verify and continue"}
      </button>
      <button className="button-quiet" onClick={changeNumber} type="button">
        Use a different email
      </button>
    </form>
  );
}
