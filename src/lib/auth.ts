import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import User, { type UserRecord } from "@/models/User";

const SESSION_COOKIE = "jobify_session";
const SESSION_LIFETIME_SECONDS = 60 * 60 * 24 * 7;

export interface SessionClaims {
  userId: string;
  role: "seeker" | "employer";
  email: string;
  exp: number;
}

function secret(): string {
  const value = process.env.JWT_SECRET;
  if (!value || value.length < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 characters.");
  }
  return value;
}

function base64Url(value: string): string {
  return Buffer.from(value).toString("base64url");
}

function signToken(claims: SessionClaims): string {
  const header = base64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64Url(JSON.stringify(claims));
  const signature = createHmac("sha256", secret())
    .update(`${header}.${payload}`)
    .digest("base64url");
  return `${header}.${payload}.${signature}`;
}

function verifyToken(token: string): SessionClaims | null {
  const [header, payload, signature] = token.split(".");
  if (!header || !payload || !signature) return null;
  const expected = createHmac("sha256", secret())
    .update(`${header}.${payload}`)
    .digest();
  let actual: Buffer;
  try {
    actual = Buffer.from(signature, "base64url");
  } catch {
    return null;
  }
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return null;
  }
  try {
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString()) as SessionClaims;
    if (
      typeof claims.userId !== "string" ||
      (claims.role !== "seeker" && claims.role !== "employer") ||
      typeof claims.email !== "string" ||
      typeof claims.exp !== "number" ||
      claims.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }
    return claims;
  } catch {
    return null;
  }
}

export async function createSession(user: UserRecord): Promise<void> {
  const expires = new Date(Date.now() + SESSION_LIFETIME_SECONDS * 1000);
  const token = signToken({
    userId: user._id.toString(),
    role: user.role,
    email: user.email,
    exp: Math.floor(expires.getTime() / 1000),
  });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}

export async function getSession(): Promise<SessionClaims | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireSession(): Promise<SessionClaims | null> {
  const session = await getSession();
  if (!session) return null;
  await connectToDatabase();
  const user = await User.exists({ _id: session.userId });
  return user ? session : null;
}

export async function clearSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}
