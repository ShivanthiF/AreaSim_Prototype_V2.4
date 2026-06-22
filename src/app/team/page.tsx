"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus, Upload, Search, Mail, X, Check,
  MoreHorizontal, Shield, Eye, Pencil, Trash2, Users,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { mockTeamMembers } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const MotionTableRow = motion.create(TableRow);

type Role = "Admin" | "Analyst" | "Observer";
type Status = "active" | "pending";

interface Member {
  id: string;
  name: string;
  role: Role;
  email: string;
  avatar: string;
  status: Status;
}

const ROLE_CONFIG: Record<Role, { icon: React.ReactNode; color: string }> = {
  Admin:    { icon: <Shield size={11} />,  color: "bg-primary/10 text-primary" },
  Analyst:  { icon: <Pencil size={11} />,  color: "bg-accent/10 text-accent" },
  Observer: { icon: <Eye size={11} />,     color: "bg-amber-500/10 text-amber-600" },
};

const PASTEL_AVATAR_COLORS = [
  "bg-[#7A6BAF]/10 text-[#7A6BAF]",
  "bg-[#4A7AAE]/10 text-[#4A7AAE]",
  "bg-[#139485]/10 text-[#139485]",
  "bg-[#C47A2C]/10 text-[#C47A2C]",
];

// ─── Add Member Modal ─────────────────────────────────────────────────────────
function AddMemberModal({ onClose, onAdd }: { onClose: () => void; onAdd: (m: Member) => void }) {
  const [tab, setTab] = useState<"email" | "csv">("email");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("Observer");
  const [csvText, setCsvText] = useState("");
  const [success, setSuccess] = useState(false);

  const handleAdd = () => {
    if (!email.trim()) return;
    const name = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    onAdd({ id: `tm-${Date.now()}`, name, role, email: email.trim(), avatar: name.split(" ").map(n => n[0]).join("").toUpperCase(), status: "pending" });
    setSuccess(true);
    setTimeout(onClose, 1200);
  };

  const handleCSV = () => {
    const lines = csvText.trim().split("\n").filter(Boolean);
    lines.forEach((line, i) => {
      const [csvEmail, csvRole] = line.split(",").map(s => s.trim());
      if (!csvEmail) return;
      const name = csvEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      onAdd({ id: `tm-csv-${Date.now()}-${i}`, name, role: (csvRole as Role) || "Observer", email: csvEmail, avatar: name.split(" ").map(n => n[0]).join("").toUpperCase(), status: "pending" });
    });
    setSuccess(true);
    setTimeout(onClose, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className="w-full max-w-md rounded-3xl bg-surface border border-border shadow-2xl overflow-hidden"
      >
        {/* Header gradient */}
        <div className="bg-gradient-to-br from-primary via-primary to-accent px-6 pt-6 pb-8 relative">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white transition-colors">
            <X size={14} />
          </button>
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <UserPlus size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white" style={{ fontFamily: "var(--font-manrope)" }}>Add team member</h2>
              <p className="text-white/70 text-xs font-body">Invite colleagues to collaborate</p>
            </div>
          </div>
        </div>

        <div className="px-6 pt-5 pb-6 -mt-3 bg-surface rounded-t-3xl relative z-10">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="py-6 flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center">
                  <Check size={22} className="text-accent" />
                </div>
                <p className="text-sm font-semibold text-text font-body">Invite sent!</p>
              </motion.div>
            ) : (
              <motion.div key="form" className="space-y-4">
                {/* Tabs */}
                <div className="flex gap-1 p-1 bg-surface-2 rounded-xl">
                  {(["email", "csv"] as const).map(t => (
                    <button key={t} onClick={() => setTab(t)}
                      className={cn("flex-1 py-1.5 rounded-lg text-xs font-semibold font-body transition-all",
                        tab === t ? "bg-surface text-text shadow-sm" : "text-text-muted hover:text-text")}>
                      {t === "email" ? "📧 Enter Email" : "📄 Upload CSV"}
                    </button>
                  ))}
                </div>

                {tab === "email" ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-text-muted tracking-wider font-body">Email address</label>
                      <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-3 py-2.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
                        <Mail size={14} className="text-text-muted shrink-0" />
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                          placeholder="colleague@company.no"
                          className="text-sm text-text bg-transparent outline-none font-body flex-1 placeholder:text-text-muted/60" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-text-muted tracking-wider font-body">Role</label>
                      <select value={role} onChange={e => setRole(e.target.value as Role)}
                        className="mt-1.5 w-full rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-sm text-text font-body focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all">
                        {(["Observer", "Analyst", "Admin"] as Role[]).map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                    <button onClick={handleAdd} disabled={!email.trim()}
                      className="w-full rounded-xl bg-primary hover:bg-primary-light text-white font-semibold py-2.5 text-sm font-body transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      <UserPlus size={15} /> Send invite
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-text-muted font-body">One row per member: <code className="bg-surface-2 px-1 rounded text-[11px]">email, role</code></p>
                    <textarea value={csvText} onChange={e => setCsvText(e.target.value)}
                      rows={5} placeholder={"sarah@acme.no, Analyst\njohn@acme.no, Observer"}
                      className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-sm text-text font-body focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all resize-none placeholder:text-text-muted/50" />
                    <button onClick={handleCSV} disabled={!csvText.trim()}
                      className="w-full rounded-xl bg-primary hover:bg-primary-light text-white font-semibold py-2.5 text-sm font-body transition-all disabled:opacity-40 flex items-center justify-center gap-2">
                      <Upload size={15} /> Import & send invites
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Member row ───────────────────────────────────────────────────────────────
function MemberRow({ member, onRemove, index }: { member: Member; onRemove: () => void; index: number }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const cfg = ROLE_CONFIG[member.role];
  return (
    <MotionTableRow
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group"
    >
      {/* Member: avatar + name + email */}
      <TableCell>
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0", PASTEL_AVATAR_COLORS[index % 4])}>
            {member.avatar}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-text font-body truncate">{member.name}</p>
            <p className="text-xs text-text-muted font-body truncate">{member.email}</p>
          </div>
        </div>
      </TableCell>

      {/* Role badge */}
      <TableCell className="hidden sm:table-cell">
        <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold font-body", cfg.color)}>
          {cfg.icon} {member.role}
        </span>
      </TableCell>

      {/* Status badge */}
      <TableCell className="hidden md:table-cell">
        <span className={cn("inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold font-body",
          member.status === "active" ? "bg-accent/10 text-accent" : "bg-amber-500/10 text-amber-600")}>
          {member.status === "active" ? "Active" : "Pending"}
        </span>
      </TableCell>

      {/* Actions */}
      <TableCell className="text-right">
        <div className="relative inline-block">
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:bg-border transition-colors opacity-0 group-hover:opacity-100">
            <MoreHorizontal size={15} />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  className="absolute right-0 top-full mt-1 w-40 rounded-xl border border-border bg-surface shadow-lg z-50 py-1 overflow-hidden text-left"
                >
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-text-muted hover:bg-surface-2 hover:text-text transition-colors font-body">
                    <Pencil size={12} /> Edit role
                  </button>
                  <button onClick={() => { onRemove(); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors font-body">
                    <Trash2 size={12} /> Remove
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </TableCell>
    </MotionTableRow>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>(mockTeamMembers);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "pending">("all");

  const filtered = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === "all" || m.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <AppLayout>
      <div className="px-6 py-8 max-w-7xl mx-auto space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-text" style={{ fontFamily: "var(--font-manrope)" }}>
              Members
            </h1>
            <p className="text-sm text-text-muted font-body mt-0.5">
              {members.length} member{members.length !== 1 ? "s" : ""} in your workspace
            </p>
          </div>
          <Button icon={<UserPlus size={16} />} onClick={() => setShowModal(true)}>
            Invite member
          </Button>
        </div>

        {/* Filters + search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-1 rounded-xl p-1" style={{ background: "#E0F2F2" }}>
            {(["all", "active", "pending"] as const).map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={cn("px-4 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  activeTab === t ? "bg-white shadow-sm text-primary border border-border" : "text-text-muted hover:text-text")}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
                <span className="ml-1.5 opacity-60 text-[10px]">
                  {t === "all" ? members.length : members.filter(m => m.status === t).length}
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 flex-1 sm:max-w-64 transition-all">
            <Search size={14} className="text-text-muted shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search members…"
              className="text-sm bg-transparent outline-none font-body flex-1 placeholder:text-text-muted/60 text-text" />
          </div>
        </div>

        {/* Members table */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto mb-3">
              <Users size={20} className="text-text-muted" />
            </div>
            <p className="text-sm font-semibold text-text">No members found</p>
            <p className="text-xs text-text-muted mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead className="hidden sm:table-cell w-40">Role</TableHead>
                <TableHead className="hidden md:table-cell w-28">Status</TableHead>
                <TableHead className="w-12 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((member, i) => (
                <MemberRow
                  key={member.id}
                  member={member}
                  onRemove={() => setMembers(prev => prev.filter(m => m.id !== member.id))}
                  index={i}
                />
              ))}
            </TableBody>
          </Table>
        )}

        {/* Info note */}
        <p className="text-xs text-text-muted font-body text-center">
          To assign members to a specific project, go to the project&apos;s <strong>Team</strong> tab and search existing members.
        </p>
      </div>

      <AnimatePresence>
        {showModal && (
          <AddMemberModal
            onClose={() => setShowModal(false)}
            onAdd={m => setMembers(prev => [...prev, m])}
          />
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
