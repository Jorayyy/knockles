"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ExternalLink,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings2,
  X,
} from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import { COLLECTION_SCHEMAS } from "@/app/admin/schema";
import { Wordmark } from "@/components/site/wordmark";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const MAIN_NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { href: "/admin/leads", label: "Leads", icon: <MessageSquare size={16} /> },
  { href: "/admin/media", label: "Media", icon: <ImageIcon size={16} /> },
  { href: "/admin/settings", label: "Settings", icon: <Settings2 size={16} /> },
];

const CONTENT_NAV: NavItem[] = Object.entries(COLLECTION_SCHEMAS).map(
  ([key, schema]) => ({
    href: `/admin/content/${key}`,
    label: schema.label,
    icon: <FileText size={16} />,
  })
);

function NavLink({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 border px-3 py-2.5 text-sm transition-colors",
        active
          ? "border-flare/50 bg-flare/10 text-flare-soft"
          : "border-transparent text-muted hover:border-line hover:bg-ink hover:text-chalk"
      )}
      aria-current={active ? "page" : undefined}
    >
      <span className="shrink-0" aria-hidden="true">
        {item.icon}
      </span>
      {item.label}
    </Link>
  );
}

function Nav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(href);

  return (
    <nav className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        {MAIN_NAV.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={isActive(item.href)}
            onNavigate={onNavigate}
          />
        ))}
      </div>
      <div>
        <p className="u-label px-3 pb-2 text-muted-dim">Content</p>
        <div className="flex flex-col gap-1">
          {CONTENT_NAV.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={isActive(item.href)}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}

function SidebarFooter() {
  return (
    <div className="flex flex-col gap-2 border-t border-line pt-5">
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-3 border border-transparent px-3 py-2.5 text-sm text-muted transition-colors hover:border-line hover:bg-ink hover:text-chalk"
      >
        <ExternalLink size={16} aria-hidden="true" />
        View site
      </Link>
      <form action={logoutAction}>
        <button
          type="submit"
          className="flex w-full items-center gap-3 border border-transparent px-3 py-2.5 text-sm text-muted transition-colors hover:border-line hover:bg-ink hover:text-chalk"
        >
          <LogOut size={16} aria-hidden="true" />
          Log out
        </button>
      </form>
    </div>
  );
}

export function AdminShell({
  children,
  wordmark,
}: {
  children: React.ReactNode;
  wordmark: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ink text-chalk">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col justify-between overflow-y-auto border-r border-line bg-ink-800 p-5 lg:flex">
        <div className="flex flex-col gap-8">
          <Wordmark wordmark={wordmark} className="h-7" />
          <Nav />
        </div>
        <SidebarFooter />
      </aside>

      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-ink-800 px-4 py-3 lg:hidden">
        <Wordmark wordmark={wordmark} className="h-6" />
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center border border-line text-muted"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {open ? (
        <div className="fixed inset-x-0 top-[57px] z-30 max-h-[calc(100vh-57px)] overflow-y-auto border-b border-line bg-ink-800 p-5 lg:hidden">
          <Nav onNavigate={() => setOpen(false)} />
          <div className="mt-6">
            <SidebarFooter />
          </div>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
          {children}
        </main>
      </div>
    </div>
  );
}
