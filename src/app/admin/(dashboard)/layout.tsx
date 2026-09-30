import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { getSettings } from "@/lib/content/access";
import { AdminShell } from "@/components/admin/shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jar = await cookies();
  if (!verifySessionToken(jar.get(COOKIE_NAME)?.value)) {
    redirect("/admin/login");
  }

  const settings = await getSettings();
  return <AdminShell wordmark={settings.business.wordmark}>{children}</AdminShell>;
}
