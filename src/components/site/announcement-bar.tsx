import { Megaphone } from "lucide-react";
import { getSettings } from "@/lib/content/access";

export async function AnnouncementBar() {
  const { announcement } = await getSettings();
  if (!announcement.enabled || !announcement.text.trim()) return null;

  return (
    <div className="bg-flare text-white">
      <div className="u-shell flex min-h-10 flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2 text-center">
        <Megaphone size={14} aria-hidden="true" className="shrink-0" />
        <p className="text-xs font-medium tracking-wide">{announcement.text}</p>
        {announcement.linkLabel && announcement.linkHref ? (
          <a
            href={announcement.linkHref}
            className="u-label border-b border-white/60 pb-0.5 transition-colors hover:border-white"
            data-track="announcement_click"
          >
            {announcement.linkLabel}
          </a>
        ) : null}
      </div>
    </div>
  );
}
