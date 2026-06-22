"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Bell, Lock, Building2, type LucideIcon } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { mockUser } from "@/lib/mockData";
import { cn } from "@/lib/utils";

type Tab = "profile" | "notifications" | "security" | "organization";

const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: "profile",       label: "Profile",       icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security",      label: "Security",      icon: Lock },
  { id: "organization",  label: "Organization",  icon: Building2 },
];

function InputField({ label, placeholder, type = "text", defaultValue }: {
  label: string; placeholder?: string; type?: string; defaultValue?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-text font-body">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-sm text-text font-body placeholder:text-text-muted/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
      />
    </div>
  );
}

function ToggleRow({ label, sub, defaultOn = false }: { label: string; sub?: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <p className="text-sm font-medium text-text font-body">{label}</p>
        {sub && <p className="text-xs text-text-muted font-body">{sub}</p>}
      </div>
      <button
        onClick={() => setOn(!on)}
        className={cn(
          "relative w-10 h-5.5 rounded-full transition-colors",
          on ? "bg-accent" : "bg-border"
        )}
        style={{ minWidth: "2.5rem", height: "1.25rem" }}
      >
        <motion.span
          animate={{ x: on ? 18 : 2 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
          style={{ display: "inline-block" }}
        />
      </button>
    </div>
  );
}

function ProfileTab() {
  return (
    <div className="space-y-6 max-w-lg">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xl font-bold shrink-0">
          {mockUser.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div>
          <p className="text-sm font-semibold text-text font-body">{mockUser.name}</p>
          <p className="text-xs text-text-muted font-body">{mockUser.role}</p>
          <button className="text-xs text-primary font-semibold hover:underline mt-1 font-body">Change photo</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="First Name"    defaultValue="Ingrid" />
        <InputField label="Last Name"     defaultValue="Hansen" />
        <InputField label="Email"         type="email" defaultValue={mockUser.email} />
        <InputField label="Phone"         placeholder="+47 000 00 000" />
        <InputField label="Job Title"     defaultValue={mockUser.role} />
        <InputField label="Department"    placeholder="e.g. Facilities" />
      </div>

      <button className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-light transition-colors shadow-md shadow-primary/20">
        Save Changes
      </button>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div className="max-w-lg space-y-6">
      <div className="rounded-2xl border border-border bg-surface p-5">
        <p className="text-sm font-extrabold text-text mb-1" style={{ fontFamily: "var(--font-manrope)" }}>Email Notifications</p>
        <p className="text-xs text-text-muted font-body mb-4">Choose which emails you receive from AreaSim.</p>
        <div>
          <ToggleRow label="Survey completed"        sub="When a survey reaches 100% responses"  defaultOn={true} />
          <ToggleRow label="Room counted"            sub="When a room count is submitted"         defaultOn={false} />
          <ToggleRow label="New team member"         sub="When someone joins your project"        defaultOn={true} />
          <ToggleRow label="Weekly digest"           sub="Summary of activity every Monday"       defaultOn={true} />
          <ToggleRow label="Product updates"         sub="New features and announcements"         defaultOn={false} />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <p className="text-sm font-extrabold text-text mb-1" style={{ fontFamily: "var(--font-manrope)" }}>In-App Notifications</p>
        <div>
          <ToggleRow label="Activity feed updates"   defaultOn={true} />
          <ToggleRow label="Mention alerts"          defaultOn={true} />
          <ToggleRow label="System announcements"    defaultOn={false} />
        </div>
      </div>
    </div>
  );
}

function SecurityTab() {
  return (
    <div className="max-w-lg space-y-6">
      <div className="rounded-2xl border border-border bg-surface p-5 space-y-4">
        <p className="text-sm font-extrabold text-text" style={{ fontFamily: "var(--font-manrope)" }}>Change Password</p>
        <InputField label="Current Password"  type="password" placeholder="••••••••" />
        <InputField label="New Password"      type="password" placeholder="••••••••" />
        <InputField label="Confirm Password"  type="password" placeholder="••••••••" />
        <button className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-light transition-colors">
          Update Password
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <p className="text-sm font-extrabold text-text mb-1" style={{ fontFamily: "var(--font-manrope)" }}>Two-Factor Authentication</p>
        <p className="text-xs text-text-muted font-body mb-4">Add an extra layer of security to your account.</p>
        <ToggleRow label="Enable 2FA" sub="Use an authenticator app" defaultOn={false} />
      </div>

      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
        <p className="text-sm font-extrabold text-red-500 mb-1" style={{ fontFamily: "var(--font-manrope)" }}>Danger Zone</p>
        <p className="text-xs text-text-muted font-body mb-4">Permanently delete your account and all associated data.</p>
        <button className="px-4 py-2 rounded-xl border border-red-500/30 text-red-500 text-sm font-semibold hover:bg-red-500/10 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  );
}

function OrganizationTab() {
  return (
    <div className="max-w-lg space-y-6">
      <div className="rounded-2xl border border-border bg-surface p-5 space-y-4">
        <p className="text-sm font-extrabold text-text" style={{ fontFamily: "var(--font-manrope)" }}>Organization Details</p>
        <InputField label="Organization Name" defaultValue="Oslo Health AS" />
        <InputField label="Organization Number" placeholder="e.g. 123 456 789" />
        <div className="grid grid-cols-2 gap-4">
          <InputField label="City" defaultValue="Oslo" />
          <InputField label="Country" defaultValue="Norway" />
        </div>
        <InputField label="Billing Email" type="email" defaultValue="billing@oslo-health.no" />
        <button className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-light transition-colors shadow-md shadow-primary/20">
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  return (
    <AppLayout breadcrumbs={[{ label: "Settings" }]}>
      <div className="px-6 py-8 max-w-5xl mx-auto">
        <h1 className="text-xl font-extrabold text-text mb-6" style={{ fontFamily: "var(--font-manrope)" }}>
          Settings
        </h1>

        <div className="flex gap-8 flex-col md:flex-row">
          {/* Side tabs */}
          <nav className="flex md:flex-col gap-1 shrink-0 md:w-48 overflow-x-auto md:overflow-x-visible">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold font-body transition-all whitespace-nowrap",
                  activeTab === id
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "text-text-muted hover:bg-surface-2 hover:text-text"
                )}
              >
                <Icon size={16} className={activeTab === id ? "text-white" : "text-text-muted"} />
                {label}
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "profile"       && <ProfileTab />}
                {activeTab === "notifications" && <NotificationsTab />}
                {activeTab === "security"      && <SecurityTab />}
                {activeTab === "organization"  && <OrganizationTab />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
