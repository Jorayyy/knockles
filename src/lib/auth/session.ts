import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "knockls_admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export { COOKIE_NAME, MAX_AGE_SECONDS };

function getSecret(): string | null {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  if (process.env.ADMIN_PASSWORD) {
    return `knockls:${process.env.ADMIN_PASSWORD}`;
  }
  return null;
}

export function adminCredentialsConfigured(): boolean {
  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD);
}

function sign(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function createSessionToken(): string | null {
  const secret = getSecret();
  if (!secret) return null;
  const payload = JSON.stringify({
    exp: Date.now() + MAX_AGE_SECONDS * 1000,
  });
  const encoded = Buffer.from(payload).toString("base64url");
  return `${encoded}.${sign(encoded, secret)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const secret = getSecret();
  if (!secret) return false;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return false;
  const expected = sign(encoded, secret);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  if (!timingSafeEqual(a, b)) return false;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString());
    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export function credentialsMatch(
  username: string | undefined,
  password: string | undefined
): boolean {
  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPass = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPass || !username || !password) return false;
  const userBuffer = Buffer.from(username);
  const passBuffer = Buffer.from(password);
  const userExpected = Buffer.from(expectedUser);
  const passExpected = Buffer.from(expectedPass);
  const userOk =
    userBuffer.length === userExpected.length &&
    timingSafeEqual(userBuffer, userExpected);
  const passOk =
    passBuffer.length === passExpected.length &&
    timingSafeEqual(passBuffer, passExpected);
  return userOk && passOk;
}
