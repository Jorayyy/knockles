import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { getSettings } from "@/lib/content/access";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Owner login — Knock'ls Boxing Gym",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const jar = await cookies();
  if (verifySessionToken(jar.get(COOKIE_NAME)?.value)) redirect("/admin");

  const [{ next }, settings] = await Promise.all([searchParams, getSettings()]);
  return <LoginForm next={next} wordmark={settings.business.wordmark} />;
}
