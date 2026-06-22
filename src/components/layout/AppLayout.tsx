"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FolderOpen, ClipboardList, Users,
  Bell, Settings, CreditCard, HelpCircle, LogOut,
} from "lucide-react";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { Logo } from "@/components/ui/Logo";
import { WorkplaceJourneyBar } from "@/components/ui/WorkplaceJourneyBar";
import { mockUser } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/UserAvatar";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard",    href: "/dashboard" },
  { icon: FolderOpen,      label: "Projects",     href: "/project" },
  { icon: ClipboardList,   label: "Surveys",      href: "/surveys" },
  { icon: Users,           label: "Members",      href: "/team" },
];

const MOCK_NOTIFICATIONS = [
  { id: 1, text: "Space Satisfaction Survey completed", time: "2h ago", unread: true },
  { id: 2, text: "John K. counted Conference Room A",   time: "4h ago", unread: true },
  { id: 3, text: "New floor added: 2nd Floor",          time: "Yesterday", unread: false },
];

interface AppLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  showJourneyBar?: boolean;
}

export function AppLayout({ children, showJourneyBar = false }: AppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-40 flex items-center gap-2 px-4 py-0 border-b border-border bg-white shrink-0 h-14">
        {/* Logo */}
        <Link href="/dashboard" className="shrink-0 mr-2">
          <Logo size="md" showText />
        </Link>

        {/* Separator */}
        <div className="w-px h-6 bg-border mx-1 hidden md:block" />

        {/* Nav tabs */}
        <nav className="hidden md:flex items-stretch gap-0 flex-1 self-stretch">
          {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative flex items-center gap-2 px-4 text-sm font-medium font-body transition-all border-b-2",
                  active
                    ? "text-primary border-primary"
                    : "text-text-muted border-transparent hover:text-text hover:border-border"
                )}
              >
                <Icon size={15} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-1.5">
          <LanguageSelector />

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
              className="relative w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-2 transition-colors"
            >
              <Bell size={16} />
            </button>
            <AnimatePresence>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-border bg-surface shadow-xl z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                      <p className="text-sm font-semibold text-text">Notifications</p>
                      <span className="text-xs text-text-muted">{unreadCount} unread</span>
                    </div>
                    {MOCK_NOTIFICATIONS.map((n) => (
                      <div key={n.id}
                        className={cn("flex gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-surface-2 transition-colors cursor-pointer", n.unread && "bg-primary/[0.03]")}>
                        <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", n.unread ? "bg-accent" : "bg-border")} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-text font-body leading-snug">{n.text}</p>
                          <p className="text-xs text-text-muted mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Profile dropdown */}
          <div className="relative">
            <UserAvatar onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }} />
            <AnimatePresence>
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-border bg-surface shadow-xl z-50 overflow-hidden py-1"
                  >
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-semibold text-text truncate">{mockUser.name}</p>
                      <p className="text-xs text-text-muted truncate">{mockUser.email}</p>
                    </div>
                    {/* Menu items */}
                    {[
                      { icon: Settings,    label: "Settings",     href: "/settings" },
                      { icon: CreditCard,  label: "Subscription", href: "/subscription" },
                      { icon: HelpCircle,  label: "Help",         href: "/help" },
                    ].map(({ icon: Icon, label, href }) => (
                      <button key={href}
                        onClick={() => { router.push(href); setProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-muted hover:bg-surface-2 hover:text-text transition-colors font-body">
                        <Icon size={15} />
                        {label}
                      </button>
                    ))}
                    <div className="border-t border-border mt-1">
                      <button
                        onClick={() => setProfileOpen(false)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-body">
                        <LogOut size={15} />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* ── Workplace Journey Bar ── */}
      {showJourneyBar && <WorkplaceJourneyBar activeStep="1-2" />}

      {/* ── Page Content ── */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
