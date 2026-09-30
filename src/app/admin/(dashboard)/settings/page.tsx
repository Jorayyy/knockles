import type { Metadata } from "next";
import { saveSettingsAction } from "@/app/admin/actions";
import { SETTINGS_SECTIONS } from "@/app/admin/schema";
import { getSettings } from "@/lib/content/access";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata: Metadata = {
  title: "Settings — Admin",
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="u-label text-flare-soft">Settings</p>
        <h1 className="u-display mt-3 text-5xl">Site configuration</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Business details, page copy and SEO defaults shared across the whole
          site. Save one group at a time.
        </p>
      </header>

      <div className="flex flex-col divide-y divide-line border border-line bg-ink-800">
        {SETTINGS_SECTIONS.map((section) => (
          <section
            key={section.key}
            className="p-6 sm:p-8"
            id={section.key}
          >
            <SettingsForm
              section={section}
              initial={settings[section.key] as unknown as Record<
                string,
                unknown
              >}
              action={saveSettingsAction.bind(null, section.key)}
            />
          </section>
        ))}
      </div>
    </div>
  );
}
