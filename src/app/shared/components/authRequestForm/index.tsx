import type { FormEvent } from "react";
import type { UserRole } from "@/types/platform";

type Mode = "login" | "signup";

interface Props {
  mode: Mode;
  role: UserRole;
  setRole: (role: UserRole) => void;
  destination: string;
  setDestination: (destination: string) => void;
  fullName: string;
  setFullName: (name: string) => void;
  isLoading: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function AuthRequestForm({
  mode,
  role,
  setRole,
  destination,
  setDestination,
  fullName,
  setFullName,
  isLoading,
  onSubmit,
}: Props) {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
      {mode === "signup" && (
        <div className="filter-group">
          <label htmlFor="full-name">Full name</label>
          <input
            autoComplete="name"
            className="filter-control"
            id="full-name"
            onChange={(event) => setFullName(event.target.value)}
            required
            value={fullName}
          />
        </div>
      )}
      <div className="filter-group">
        <label htmlFor="role">I’m joining as</label>
        <select
          className="filter-control"
          id="role"
          onChange={(event) =>
            setRole(event.target.value === "employer" ? "employer" : "seeker")
          }
          value={role}
        >
          <option value="seeker">Job Seeker</option>
          <option value="employer">Employer</option>
        </select>
      </div>
      <div className="filter-group">
        <label htmlFor="destination">Email address</label>
        <input
          autoComplete="email"
          className="filter-control"
          id="destination"
          inputMode="email"
          onChange={(event) => setDestination(event.target.value)}
          placeholder="you@example.com"
          required
          type="email"
          value={destination}
        />
      </div>
      {mode === "signup" && (
        <p className="muted-copy auth-privacy">
          By continuing, you agree to use Jobify responsibly and never request
          or pay for a job opportunity.
        </p>
      )}
      <button className="button-primary auth-submit" disabled={isLoading} type="submit">
        {isLoading ? "Sending code…" : "Continue"}
      </button>
    </form>
  );
}
