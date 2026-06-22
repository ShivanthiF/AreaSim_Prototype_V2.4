"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Button,
  ButtonVariant,
  Input,
  Badge,
  Card,
  Chip,
  Logo,
  EmptyState,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui";
import { UserAvatar } from "@/components/ui/UserAvatar";
import {
  Search,
  Plus,
  ArrowRight,
  Check,
  CheckCircle2,
  AlertCircle,
  Settings,
  User,
  LayoutDashboard,
  BarChart3,
  FolderOpen,
  Building2,
  TrendingUp,
  ClipboardCheck,
  ChevronRight,
  ChevronDown,
  Map,
  Users,
  Calendar,
  Mail,
  Phone,
  Eye,
  EyeOff,
  X as XIcon,
} from "lucide-react";

export default function StyleGuidePage() {
  const [activeSection, setActiveSection] = useState("foundations");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["foundations"]));

  const sections = [
    {
      id: "foundations",
      title: "Foundations",
      subsections: [
        { id: "color-palette", title: "Color Palette" },
        { id: "typography-system", title: "Typography System" },
      ],
    },
    {
      id: "atoms",
      title: "1. Atoms",
      subsections: [
        { id: "buttons", title: "Buttons" },
        { id: "inputs", title: "Inputs" },
        { id: "selection-controls", title: "Selection Controls" },
        { id: "badges-chips", title: "Badges & Chips" },
        { id: "avatars-icons", title: "Avatars & Icons" },
      ],
    },
    {
      id: "molecules",
      title: "2. Molecules",
      subsections: [
        { id: "search-bar", title: "Search Bar" },
        { id: "form-groups", title: "Form Groups" },
        { id: "tabs-navigation", title: "Tabs & Navigation" },
        { id: "stat-cards", title: "Stat Cards" },
        { id: "alert-messages", title: "Alert Messages" },
        { id: "empty-states", title: "Empty States" },
      ],
    },
    {
      id: "organisms",
      title: "3. Organisms",
      subsections: [
        { id: "dashboard-header", title: "Dashboard Header" },
        { id: "sidebar-navigation", title: "Sidebar Navigation" },
        { id: "data-table", title: "Data Table" },
      ],
    },
    { id: "templates", title: "4. Templates", subsections: [] },
    {
      id: "pages",
      title: "5. Pages",
      subsections: [],
    },
  ];

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background-alt flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-border bg-surface p-8 sticky top-0 h-screen overflow-y-auto hidden lg:block">
        <div className="mb-12">
          <Logo size="sm" />
          <p className="text-[10px] tracking-widest text-text-muted mt-2 font-semibold">Design System v1.0</p>
        </div>

        <nav className="space-y-0.5">
          {sections.map((section) => {
            const isExpanded = expandedSections.has(section.id);
            const isActive = activeSection === section.id;
            return (
              <div key={section.id}>
                <button
                  onClick={() => {
                    setActiveSection(section.id);
                    document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" });
                    if (section.subsections && section.subsections.length > 0) toggleSection(section.id);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${isActive
                      ? "bg-primary/10 text-primary"
                      : "text-text-muted hover:bg-surface-2 hover:text-text"
                    }`}
                >
                  <span>{section.title}</span>
                  {section.subsections && section.subsections.length > 0 && (
                    <ChevronRight
                      size={13}
                      className="shrink-0 transition-transform duration-200"
                      style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}
                    />
                  )}
                </button>
                {section.subsections && section.subsections.length > 0 && isExpanded && (
                  <div className="ml-4 mt-0.5 space-y-0.5 border-l border-border pl-3">
                    {section.subsections.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => {
                          document.getElementById(sub.id)?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-md text-xs font-medium text-text-muted hover:text-primary hover:bg-primary/5 transition-all"
                      >
                        {sub.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-16 max-w-5xl mx-auto w-full">
        <header className="mb-16">
          <h1 className="text-4xl font-extrabold text-text mb-4">UI Component Library</h1>
          <p className="text-text-muted text-lg max-w-2xl">
            A comprehensive guide to the AreaSim design system. These components are built with
            accessibility, performance, and aesthetic consistency in mind.
          </p>
        </header>

        {/* Foundations Section */}
        <section id="foundations" className="mb-24 scroll-mt-8">
          <h2 className="text-3xl font-extrabold text-text mb-2">Foundations</h2>
          <p className="text-text-muted mb-12">The basic building blocks and guidelines of the AreaSim design system.</p>

          {/* Color Palette (formerly Brand & Identity) */}
          <div id="color-palette" className="space-y-8 mb-16 scroll-mt-8">
            <h3 className="text-xl font-extrabold text-text flex items-center gap-2">
              <div className="w-1.5 h-6 bg-primary rounded-full"></div>
              Color Palette
            </h3>
            <Card className="p-8 space-y-8">
              <div>
                <p className="text-sm font-semibold text-text-muted tracking-wider mb-4">Logos</p>
                <div className="flex flex-wrap items-end gap-12">
                  <div className="space-y-2">
                    <Logo size="sm" />
                    <p className="text-[10px] text-center text-text-muted">Small (24px)</p>
                  </div>
                  <div className="space-y-2">
                    <Logo size="md" />
                    <p className="text-[10px] text-center text-text-muted">Medium (30px)</p>
                  </div>
                  <div className="space-y-2">
                    <Logo size="lg" />
                    <p className="text-[10px] text-center text-text-muted">Large (40px)</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-text-muted tracking-wider mb-8">Primary Color Palette</p>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                  <ColorBox hex="#e0f2f2" name="Primary 50" />
                  <ColorBox hex="#b2dfde" name="Primary 100" />
                  <ColorBox hex="#7fccc8" name="Primary 200" />
                  <ColorBox hex="#4ab7b2" name="Primary 300" />
                  <ColorBox hex="#1fa7a0" name="Primary 400" isMain />
                  <ColorBox hex="#00978e" name="Primary 500" />
                  <ColorBox hex="#00978e" name="Primary 600" />
                  <ColorBox hex="#007a70" name="Primary 700" />
                  <ColorBox hex="#006a61" name="Primary 800" />
                  <ColorBox hex="#004e44" name="Primary 900" />
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-text-muted tracking-wider mb-8">Secondary Color Palette</p>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                  <ColorBox hex="#fbf6ee" name="Secondary 50" isMain />
                  <ColorBox hex="#f2e7db" name="Secondary 100" />
                  <ColorBox hex="#e7d8c7" name="Secondary 200" />
                  <ColorBox hex="#dac6af" name="Secondary 300" />
                  <ColorBox hex="#ccb498" name="Secondary 400" />
                  <ColorBox hex="#bfa483" name="Secondary 500" />
                  <ColorBox hex="#b19779" name="Secondary 600" />
                  <ColorBox hex="#9f876d" name="Secondary 700" />
                  <ColorBox hex="#917963" name="Secondary 800" />
                  <ColorBox hex="#806957" name="Secondary 900" />
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-text-muted tracking-wider mb-8">Neutral Color Palette</p>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                  <ColorBox hex="#fafafa" name="Neutral 50" />
                  <ColorBox hex="#f5f5f5" name="Neutral 100" />
                  <ColorBox hex="#efefef" name="Neutral 200" />
                  <ColorBox hex="#e2e2e2" name="Neutral 300" />
                  <ColorBox hex="#bfbfbf" name="Neutral 400" />
                  <ColorBox hex="#a0a0a0" name="Neutral 500" />
                  <ColorBox hex="#777777" name="Neutral 600" />
                  <ColorBox hex="#636363" name="Neutral 700" />
                  <ColorBox hex="#444444" name="Neutral 800" />
                  <ColorBox hex="#232323" name="Neutral 900" />
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-text-muted tracking-wider mb-8">UX Illustration Palette</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 sm:gap-4">
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-text-muted">Sage Green</p>
                    <div className="space-y-2">
                      <ColorBox hex="#58B184" name="Forest Sage" />
                      <ColorBox hex="#89C0A2" name="Soft Sage" />
                      <ColorBox hex="#DCEFE3" name="Mist Sage" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-text-muted">Nordic Beige</p>
                    <div className="space-y-2">
                      <ColorBox hex="#D1A45F" name="Caramel Sand" />
                      <ColorBox hex="#DEC798" name="Nordic Beige" />
                      <ColorBox hex="#EFE3C7" name="Linen Cream" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-text-muted">Sky Blue</p>
                    <div className="space-y-2">
                      <ColorBox hex="#5D8FD1" name="Ocean Blue" />
                      <ColorBox hex="#9EB7DD" name="Dusty Sky" />
                      <ColorBox hex="#DCE7F5" name="Ice Blue" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-text-muted">Lavender Purple</p>
                    <div className="space-y-2">
                      <ColorBox hex="#8E84CC" name="Iris Purple" />
                      <ColorBox hex="#B8AFDF" name="Soft Lavender" />
                      <ColorBox hex="#E8E2F5" name="Lavender Mist" />
                    </div>
                  </div>
                    <div className="space-y-4">
                      <p className="text-xs font-bold text-text-muted">Teal Green</p>
                      <div className="space-y-2">
                        <ColorBox hex="#58B39E" name="Deep Teal" />
                        <ColorBox hex="#84C6B6" name="Seafoam Teal" />
                        <ColorBox hex="#DCEFEA" name="Pale Mint Teal" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <p className="text-xs font-bold text-text-muted">Carmine Rose</p>
                      <div className="space-y-2">
                        <ColorBox hex="#E05D8B" name="Deep Carmine" />
                        <ColorBox hex="#E18EAC" name="Soft Carmine" />
                        <ColorBox hex="#FBE7ED" name="Mist Carmine" />
                      </div>
                    </div>
                </div>
              </div>

              <div className="pt-8 border-t border-border">
                <p className="text-sm font-semibold text-text-muted tracking-wider mb-8">Color Usage Reference</p>
                <div className="space-y-12">
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
                      <UsageGroup title="Core Actions">
                        <UsageItem label="Primary Intent" color="#1FA7A0" token="Primary 400" />
                        <UsageItem label="Secondary Intent" color="#FBF6EE" token="Secondary 50" />
                      </UsageGroup>
                      <UsageGroup title="Feedback States">
                        <UsageItem label="Success / Active" color="#00978E" token="Primary 500" />
                        <UsageItem label="Warning / Pending" color="#D1A45F" token="Caramel Sand" />
                        <UsageItem label="Error / Urgent" color="#C47A2C" token="Accent Warm" />
                      </UsageGroup>
                    </div>
                  </div>
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
                      <UsageGroup title="Surfaces">
                        <UsageItem label="Global Background" color="#FBF6EE" token="Secondary 50" />
                        <UsageItem label="Card Surface" color="#FFFFFF" token="Surface" />
                      </UsageGroup>
                      <UsageGroup title="Typography">
                        <UsageItem label="Main Heading / Body" color="#232323" token="Neutral 900" />
                        <UsageItem label="Muted Text" color="#777777" token="Neutral 600" />
                      </UsageGroup>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Typography */}
          <div id="typography-system" className="space-y-8 scroll-mt-8">
            <h3 className="text-xl font-extrabold text-text flex items-center gap-2">
              <div className="w-1.5 h-6 bg-primary rounded-full"></div>
              Typography System
            </h3>
            <Card className="p-8">
              <div className="space-y-12">
                <div>
                  <p className="text-sm font-semibold text-text-muted tracking-wider mb-8">Font Families</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-4">
                      <div className="text-4xl font-extrabold font-manrope">Aa</div>
                      <div>
                        <p className="text-sm font-bold text-text">Manrope</p>
                        <p className="text-xs text-text-muted">Primary Heading Font</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="text-4xl font-dm-sans">Aa</div>
                      <div>
                        <p className="text-sm font-bold text-text">DM Sans</p>
                        <p className="text-xs text-text-muted">Body & Interface Font</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="text-4xl font-mono">Aa</div>
                      <div>
                        <p className="text-sm font-bold text-text">JetBrains Mono</p>
                        <p className="text-xs text-text-muted">Monospace & Code Font</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Atoms Section */}
        <section id="atoms" className="mb-24 scroll-mt-8">
          <h2 className="text-3xl font-extrabold text-text mb-2">1. Atoms</h2>
          <p className="text-text-muted mb-12">Foundational UI elements that cannot be broken down further.</p>

          <div className="space-y-16">
            {/* Buttons */}
            <div id="buttons" className="space-y-8 scroll-mt-8">
              <h3 className="text-xl font-extrabold text-text flex items-center gap-2">
                <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                Buttons
              </h3>
              <Card className="p-8">
                <div className="space-y-16">
                  {/* Variants Section */}
                  <div>
                    <p className="text-sm font-semibold text-text-muted tracking-wider mb-8">Button Variants</p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-y-12 gap-x-8">
                      {[
                        { id: 'primary', label: 'Primary' },
                        { id: 'secondary', label: 'Secondary' },
                        { id: 'tertiary', label: 'Tertiary' },
                        { id: 'ghost', label: 'Ghost' },
                        { id: 'text', label: 'Text' },
                        { id: 'link', label: 'Link' },
                        { id: 'destructive', label: 'Destructive' },
                        { id: 'success', label: 'Success' },
                        { id: 'icon', label: 'Icon', icon: <Plus size={18} /> },
                        { id: 'fab', label: '', icon: <Plus size={24} /> },
                      ].map((v) => (
                        <div key={v.id} className="space-y-3 flex flex-col items-center">
                          <Button variant={v.id as ButtonVariant} icon={v.icon}>
                            {v.label}
                          </Button>
                          <p className="text-[10px] text-text-muted font-medium tracking-tighter">{v.id}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sizes Section */}
                  <div className="pt-12 border-t border-border">
                    <p className="text-sm font-semibold text-text-muted tracking-wider mb-8">Button Sizes</p>
                    <div className="flex flex-wrap items-end gap-12">
                      <div className="space-y-4 text-center">
                        <Button size="sm" variant="primary">Small Button</Button>
                        <p className="text-[10px] text-text-muted">SMALL (32px)</p>
                      </div>
                      <div className="space-y-4 text-center">
                        <Button size="md" variant="primary">Medium Button</Button>
                        <p className="text-[10px] text-text-muted">MEDIUM (40px)</p>
                      </div>
                      <div className="space-y-4 text-center">
                        <Button size="lg" variant="primary">Large Button</Button>
                        <p className="text-[10px] text-text-muted">LARGE (48px)</p>
                      </div>
                    </div>
                  </div>

                  {/* States Section */}
                  <div className="pt-12 border-t border-border">
                    <p className="text-sm font-semibold text-text-muted tracking-wider mb-8">Interaction States</p>
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="space-y-2 text-center">
                        <Button variant="primary">Default</Button>
                        <p className="text-[10px] text-text-muted">DEFAULT</p>
                      </div>
                      <div className="space-y-2 text-center">
                        <Button variant="primary" className="brightness-105">Hover</Button>
                        <p className="text-[10px] text-text-muted">HOVER</p>
                      </div>
                      <div className="space-y-2 text-center">
                        <Button variant="primary" className="scale-[0.98] brightness-95">Pressed</Button>
                        <p className="text-[10px] text-text-muted">PRESSED</p>
                      </div>
                      <div className="space-y-2 text-center">
                        <Button variant="primary" className="ring-2 ring-primary ring-offset-2">Focused</Button>
                        <p className="text-[10px] text-text-muted">FOCUS</p>
                      </div>
                      <div className="space-y-2 text-center">
                        <Button variant="primary" disabled>Disabled</Button>
                        <p className="text-[10px] text-text-muted">DISABLED</p>
                      </div>
                      <div className="space-y-2 text-center">
                        <Button variant="primary" loading>Loading</Button>
                        <p className="text-[10px] text-text-muted">LOADING</p>
                      </div>
                      <div className="space-y-2 text-center">
                        <Button variant="primary" selected>Selected</Button>
                        <p className="text-[10px] text-text-muted">SELECTED</p>
                      </div>
                    </div>
                  </div>

                  {/* Icon Support Section */}
                  <div className="pt-12 border-t border-border">
                    <p className="text-sm font-semibold text-text-muted tracking-wider mb-8">Icon Support</p>
                    <div className="flex flex-wrap items-center gap-8">
                      <Button variant="secondary" icon={<Plus size={16} />}>
                        Left Icon
                      </Button>
                      <Button variant="secondary" icon={<ArrowRight size={16} />} iconPosition="right">
                        Right Icon
                      </Button>
                      <Button variant="icon" icon={<Settings size={18} />} aria-label="Settings" />
                      <Button variant="primary" loading icon={<Search size={16} />}>
                        Searching
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Link Buttons */}
                <div className="pt-12 border-t border-border">
                  <p className="text-sm font-semibold text-text-muted tracking-wider mb-2">Link Buttons</p>
                  <p className="text-xs text-text-muted font-body mb-8">Use for inline navigation links. Always underlined, no icon, no arrow. Applied via <code className="text-[11px] bg-surface-2 px-1 rounded font-mono">underline</code> className on a native button or anchor.</p>
                  <div className="flex flex-wrap items-center gap-8">
                    <div className="space-y-2 flex flex-col items-start">
                      <button className="text-xs text-primary font-semibold font-body underline">View all</button>
                      <p className="text-[10px] text-text-muted tracking-tighter">xs · Section link</p>
                    </div>
                    <div className="space-y-2 flex flex-col items-start">
                      <button className="text-sm text-primary font-semibold font-body underline">Add another</button>
                      <p className="text-[10px] text-text-muted tracking-tighter">sm · Form link</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Inputs */}
            <div id="inputs" className="space-y-8 scroll-mt-8">
              <h3 className="text-xl font-extrabold text-text flex items-center gap-2">
                <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                Form Fields
              </h3>

              {/* ─── Field Types ─────────────────────────────────────────────── */}
              <Card className="p-8 space-y-16">
                <div>
                  <p className="text-sm font-semibold text-text-muted tracking-wider mb-8">Field Types</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">

                    {/* Text Input */}
                    <Input label="Text Input" placeholder="Enter your name..." />

                    {/* Search Field */}
                    <Input label="Search Field" placeholder="Search projects…" icon={<Search className="w-4 h-4" />} clearable value="" onClear={() => {}} />

                    {/* Password Field */}
                    <PasswordFieldDemo />

                    {/* Textarea */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[13px] font-semibold text-[#222B27] font-body">Textarea Field</label>
                      <textarea
                        rows={3}
                        placeholder="Type your message…"
                        className="w-full rounded-xl border-[1.5px] border-[#B8B8B8] bg-white px-5 py-3 text-sm text-[#222B27] placeholder:text-[#98A1B2] transition-all duration-200 hover:border-[#999999] hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)] focus:outline-none focus:border-[#139485] focus:ring-4 focus:ring-[rgba(19,148,133,0.18)] resize-none"
                      />
                    </div>

                    {/* Left Icon */}
                    <Input label="Input with Left Icon" placeholder="your@email.com" icon={<Mail className="w-4 h-4" />} />

                    {/* Right Icon */}
                    <Input label="Input with Right Icon" placeholder="Enter phone…" icon={<Phone className="w-4 h-4" />} iconPosition="right" />

                    {/* Helper Text */}
                    <Input label="Input with Helper Text" placeholder="your@email.com" hint="We'll never share your email with anyone." />

                    {/* Validation — Error */}
                    <Input label="Input with Error" placeholder="Enter project name…" error="This project name is already taken." defaultValue="Oslo HQ" />

                    {/* Validation — Success */}
                    <Input label="Input with Success" placeholder="Choose a username…" success="Username is available!" defaultValue="kari_nordmann" />

                    {/* Counter */}
                    <CounterFieldDemo />
                  </div>
                </div>

                {/* ─── Sizes ───────────────────────────────────────────────────── */}
                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-semibold text-text-muted tracking-wider mb-8">Field Sizes</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                    <div className="space-y-3">
                      <Input fieldSize="sm" label="Small" placeholder="Small — h-9, text-xs" />
                      <div className="grid grid-cols-3 text-[10px] text-text-muted font-mono gap-1">
                        <span>h-9 · 36px</span>
                        <span>px-4</span>
                        <span>text-xs</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Input fieldSize="md" label="Medium" placeholder="Medium — h-11, text-sm" />
                      <div className="grid grid-cols-3 text-[10px] text-text-muted font-mono gap-1">
                        <span>h-11 · 44px</span>
                        <span>px-5</span>
                        <span>text-sm</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Input fieldSize="lg" label="Large" placeholder="Large — h-14, text-base" />
                      <div className="grid grid-cols-3 text-[10px] text-text-muted font-mono gap-1">
                        <span>h-14 · 56px</span>
                        <span>px-6</span>
                        <span>text-base</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ─── States ──────────────────────────────────────────────────── */}
                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-semibold text-text-muted tracking-wider mb-8">Interaction States</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-text-muted tracking-wider">Default</p>
                      <Input placeholder="Default state" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-text-muted tracking-wider">Hover (simulated)</p>
                      <Input placeholder="Hover state" className="border-[#999999] shadow-[0_2px_8px_rgba(0,0,0,0.05)]" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-text-muted tracking-wider">Focus (simulated)</p>
                      <Input placeholder="Focus state" className="border-[#139485] ring-4 ring-[rgba(19,148,133,0.18)]" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-text-muted tracking-wider">Disabled</p>
                      <Input placeholder="Disabled state" disabled />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-text-muted tracking-wider">Error</p>
                      <Input placeholder="Error state" error="This field is required" defaultValue="" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-text-muted tracking-wider">Success</p>
                      <Input placeholder="Success state" success="Looks great!" defaultValue="valid@email.com" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-text-muted tracking-wider">Loading</p>
                      <Input placeholder="Loading…" loading />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-text-muted tracking-wider">Read-only</p>
                      <Input placeholder="" value="Read-only value" readOnly className="cursor-default" />
                    </div>
                  </div>
                </div>

                {/* ─── Dropdown / Select ────────────────────────────────────────── */}
                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-semibold text-text-muted tracking-wider mb-8">Dropdown / Select Field</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <SelectFieldDemo label="Default select" />
                    <SelectFieldDemo label="Error state" hasError />
                    <SelectFieldDemo label="Disabled" isDisabled />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
                    <SelectFieldDemo label="Small" fieldSize="sm" />
                    <SelectFieldDemo label="Medium" fieldSize="md" />
                    <SelectFieldDemo label="Large" fieldSize="lg" />
                  </div>
                </div>

                {/* ─── Multi-select ─────────────────────────────────────────────── */}
                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-semibold text-text-muted tracking-wider mb-8">Multi-select / Token Field</p>
                  <MultiSelectDemo />
                </div>

                {/* ─── Labels & Helper Text ─────────────────────────────────────── */}
                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-semibold text-text-muted tracking-wider mb-8">Labels & Helper Text</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    <Input label="Required Field" required placeholder="Required — shows * indicator" />
                    <Input label="Optional Field" optionalLabel placeholder="Optional — shows 'Optional' label" />
                    <Input label="With Helper Text" placeholder="Enter value…" hint="Helper text lives here and guides the user." />
                    <Input label="With Error Message" placeholder="Invalid input" error="This value is not valid. Please try again." />
                    <Input label="With Success" placeholder="Valid value" success="Value accepted and verified." defaultValue="valid_entry" />
                    <CounterFieldDemo />
                  </div>
                </div>

                {/* ─── Design Tokens ────────────────────────────────────────────── */}
                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-semibold text-text-muted tracking-wider mb-6">Design Tokens</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-text-muted tracking-wider">Colors</p>
                      <div className="space-y-2 text-xs font-mono">
                        {[
                          { label: "Default border",  value: "#B8B8B8" },
                          { label: "Hover border",    value: "#999999" },
                          { label: "Focus border",    value: "#139485" },
                          { label: "Focus glow",      value: "rgba(19,148,133,0.18)" },
                          { label: "Error border",    value: "#D47A1F" },
                          { label: "Error glow",      value: "rgba(212,122,31,0.18)" },
                          { label: "Label color",     value: "#222B27" },
                          { label: "Placeholder",     value: "#98A1B2" },
                          { label: "Disabled bg",     value: "#F5F5F5" },
                        ].map((t) => (
                          <div key={t.label} className="flex items-center justify-between py-1.5 border-b border-border/50">
                            <span className="text-text-muted">{t.label}</span>
                            <div className="flex items-center gap-2">
                              {!t.value.includes("rgba") && (
                                <div className="w-3 h-3 rounded-full border border-black/10" style={{ background: t.value }} />
                              )}
                              <span className="text-text">{t.value}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-text-muted tracking-wider">Sizing & Spacing</p>
                      <div className="space-y-2 text-xs font-mono">
                        {[
                          { label: "Border radius",    value: "9999px — pill / rounded-full" },
                          { label: "Border width",     value: "1.5px" },
                          { label: "Sm height",        value: "h-9 — 36px" },
                          { label: "Md height",        value: "h-11 — 44px" },
                          { label: "Lg height",        value: "h-14 — 56px" },
                          { label: "Sm padding",       value: "px-4 — 16px" },
                          { label: "Md padding",       value: "px-5 — 20px" },
                          { label: "Lg padding",       value: "px-6 — 24px" },
                          { label: "Transition",       value: "200ms ease" },
                          { label: "Focus ring",       value: "ring-4 (16px spread)" },
                        ].map((t) => (
                          <div key={t.label} className="flex items-center justify-between py-1.5 border-b border-border/50">
                            <span className="text-text-muted">{t.label}</span>
                            <span className="text-text">{t.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Selection Controls */}
            <div id="selection-controls" className="space-y-8 scroll-mt-8">
              <h3 className="text-xl font-extrabold text-text flex items-center gap-2">
                <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                Selection Controls
              </h3>
              <Card className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="space-y-6">
                    <p className="text-[10px] font-bold text-text-muted tracking-widest">Checkboxes</p>
                    <div className="space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-5 h-5 rounded border-2 border-border bg-surface group-hover:border-primary transition-colors flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-sm bg-primary"></div>
                        </div>
                        <span className="text-sm text-text">Selected State</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-5 h-5 rounded border-2 border-border bg-surface group-hover:border-primary transition-colors"></div>
                        <span className="text-sm text-text">Unselected State</span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <p className="text-[10px] font-bold text-text-muted tracking-widest">Radio Buttons</p>
                    <div className="space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-5 h-5 rounded-full border-2 border-border bg-surface group-hover:border-primary transition-colors flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                        </div>
                        <span className="text-sm text-text">Option Selected</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-5 h-5 rounded-full border-2 border-border bg-surface group-hover:border-primary transition-colors"></div>
                        <span className="text-sm text-text">Option Unselected</span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <p className="text-[10px] font-bold text-text-muted tracking-widest">Toggle Switches</p>
                    <div className="space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <div className="w-10 h-6 rounded-full bg-primary relative transition-colors">
                          <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm"></div>
                        </div>
                        <span className="text-sm text-text">Active</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <div className="w-10 h-6 rounded-full bg-border relative transition-colors">
                          <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm"></div>
                        </div>
                        <span className="text-sm text-text">Inactive</span>
                      </label>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Badges & Status */}
            <div id="badges-chips" className="space-y-8 scroll-mt-8">
              <h3 className="text-xl font-extrabold text-text flex items-center gap-2">
                <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                Badges & Chips
              </h3>
              <Card className="p-8 space-y-6">
                <div>
                  <p className="text-xs font-bold text-text-muted tracking-wider mb-3">Badge — <code className="font-mono text-primary">ui/Badge</code></p>
                  <div className="flex flex-wrap gap-4">
                    <Badge variant="active">Active</Badge>
                    <Badge variant="pending">Pending</Badge>
                    <Badge variant="urgent">Urgent</Badge>
                    <Badge variant="new">New</Badge>
                    <Badge variant="archived">Archived</Badge>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-text-muted tracking-wider mb-3">Chip — <code className="font-mono text-primary">ui/Chip</code> · used for table category &amp; status</p>
                  <div className="flex flex-wrap gap-4">
                    <Chip tone="neutral">Neutral</Chip>
                    <Chip tone="success" icon={<Check size={9} strokeWidth={3} />}>Success</Chip>
                    <Chip tone="warning" icon={<span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}>Warning</Chip>
                    <Chip tone="info">Info</Chip>
                    <Chip tone="accent">Accent</Chip>
                  </div>
                </div>
              </Card>
            </div>

            {/* Avatars & Icons */}
            <div id="avatars-icons" className="space-y-8 scroll-mt-8">
              <h3 className="text-xl font-extrabold text-text flex items-center gap-2">
                <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                Avatars & Icons
              </h3>
              <Card className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <p className="text-[10px] font-bold text-text-muted tracking-widest">Avatars</p>
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">KN</div>
                      <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary-900 font-bold text-sm">AS</div>
                      <div className="w-8 h-8 rounded-full border-2 border-surface bg-neutral-200 flex items-center justify-center">
                        <User className="w-4 h-4 text-neutral-500" />
                      </div>
                    </div>
                    {/* User Avatar component */}
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-text-muted tracking-wider">User Avatar</p>
                      <div className="flex items-center gap-4">
                        <UserAvatar />
                        <div>
                          <p className="text-sm font-semibold text-text">UserAvatar</p>
                          <p className="text-xs text-text-muted font-body">Purple gradient · <code className="font-mono text-primary">w-8 h-8</code> · Links to /settings</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <p className="text-[10px] font-bold text-text-muted tracking-widest">Navigation Icons</p>
                    <div className="flex flex-wrap gap-6 text-text-muted">
                      <LayoutDashboard className="w-5 h-5" />
                      <BarChart3 className="w-5 h-5" />
                      <Users className="w-5 h-5" />
                      <Settings className="w-5 h-5" />
                      <Calendar className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Molecules Section */}
        <section id="molecules" className="mb-24 scroll-mt-8">
          <h2 className="text-3xl font-extrabold text-text mb-2">2. Molecules</h2>
          <p className="text-text-muted mb-12">Groups of atoms bonded together to take on new properties.</p>

          <div className="space-y-16">
            {/* Search Bar */}
            <div id="search-bar" className="space-y-8 scroll-mt-8">
              <h3 className="text-xl font-extrabold text-text flex items-center gap-2">
                <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                Search Bar
              </h3>
              <Card className="p-8">
                <div className="flex items-center gap-3 w-full max-w-2xl bg-background-alt p-2 rounded-2xl border border-border">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <Input className="pl-10 border-none bg-transparent shadow-none focus:ring-0" placeholder="Search anything..." />
                  </div>
                  <Button variant="primary" size="sm">Search</Button>
                </div>
              </Card>
            </div>

            {/* Form Groups */}
            <div id="form-groups" className="space-y-8 scroll-mt-8">
              <h3 className="text-xl font-extrabold text-text flex items-center gap-2">
                <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                Form Groups
              </h3>
              <Card className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text">Full Name</label>
                    <Input placeholder="Kari Nordmann" />
                    <p className="text-[10px] text-text-muted italic">Please enter your legal name as it appears on ID.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text flex justify-between">
                      Email Address
                      <span className="text-[10px] text-primary">Required</span>
                    </label>
                    <Input placeholder="kari@areasim.com" />
                  </div>
                  <div className="space-y-2">
                    <Input label="Project Title" defaultValue="Oslo HQ" error="This project title is already taken." />
                  </div>
                </div>
              </Card>
            </div>

            {/* Tabs & Navigation */}
            <div id="tabs-navigation" className="space-y-8 scroll-mt-8">
              <h3 className="text-xl font-extrabold text-text flex items-center gap-2">
                <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                Tabs & Navigation
              </h3>
              <Card className="p-8">
                <div className="space-y-12">
                  <div className="flex items-center border-b border-border">
                    {["Overview", "Analytics", "Team", "Settings"].map((tab, i) => (
                      <div
                        key={tab}
                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors cursor-pointer ${i === 0 ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-text"
                          }`}
                      >
                        {tab}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <span>Projects</span>
                    <ChevronRight className="w-3 h-3" />
                    <span>Workspace</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-text font-bold">Oslo HQ Optimization</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Stat Cards */}
            <div id="stat-cards" className="space-y-8 scroll-mt-8">
              <h3 className="text-xl font-extrabold text-text flex items-center gap-2">
                <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                Stat Cards
              </h3>
              {/* Overview Stat Card — horizontal layout */}
              <div>
                <p className="text-xs font-semibold text-text-muted tracking-wider mb-3">Overview Stat Card</p>
                <p className="text-xs text-text-muted font-body mb-4">Horizontal layout: icon on left, number + label on right. Use pastel icon background matching activity section colors.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {[
                    { icon: <FolderOpen size={20} className="text-[#7A6BAF]" />, iconBg: "bg-[#7A6BAF]/10", label: "Total projects",   value: "3"  },
                    { icon: <Building2 size={20} className="text-[#4A7AAE]" />,  iconBg: "bg-[#4A7AAE]/10", label: "Rooms mapped",     value: "48" },
                    { icon: <TrendingUp size={20} className="text-[#139485]" />, iconBg: "bg-[#139485]/10", label: "Avg. utilisation", value: "72%" },
                    { icon: <ClipboardCheck size={20} className="text-[#C47A2C]" />, iconBg: "bg-[#C47A2C]/10", label: "Survey responses", value: "24" },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-6 rounded-2xl border border-border bg-surface p-6 hover:shadow-card-hover transition-shadow flex-1">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", s.iconBg)}>
                        {s.icon}
                      </div>
                      <div>
                        <p className="text-3xl font-extrabold text-text tabular-nums leading-none" style={{ fontFamily: "var(--font-manrope)" }}>{s.value}</p>
                        <p className="text-xs text-text-muted font-body mt-1">{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legacy vertical stat cards */}
              <div>
                <p className="text-xs font-semibold text-text-muted tracking-wider mb-3">Legacy Vertical Cards</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-6 space-y-2">
                    <p className="text-xs font-bold text-text-muted tracking-wider">Active Projects</p>
                    <h4 className="text-3xl font-extrabold text-text">12</h4>
                    <p className="text-[10px] text-success font-bold">+2 from last month</p>
                  </Card>
                  <Card className="p-6 space-y-2">
                    <p className="text-xs font-bold text-text-muted tracking-wider">Team Members</p>
                    <h4 className="text-3xl font-extrabold text-text">48</h4>
                    <p className="text-[10px] text-text-muted">3 pending invites</p>
                  </Card>
                  <Card className="p-6 space-y-2 border-primary/20 bg-primary/5">
                    <p className="text-xs font-bold text-primary tracking-wider">Storage Used</p>
                    <h4 className="text-3xl font-extrabold text-text">84%</h4>
                    <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                      <div className="w-[84%] h-full bg-primary"></div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {/* Alert Messages */}
            <div id="alert-messages" className="space-y-8 scroll-mt-8">
              <h3 className="text-xl font-extrabold text-text flex items-center gap-2">
                <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                Alert Messages
              </h3>
              <div className="space-y-4 max-w-3xl">
                <div className="p-4 rounded-xl bg-success/10 border border-success/20 flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                  <p className="text-sm font-medium text-success">Profile updated successfully.</p>
                </div>
                <div className="p-4 rounded-xl bg-nordic-beige/10 border border-nordic-beige/20 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-nordic-beige-dark shrink-0" />
                  <p className="text-sm font-medium text-nordic-beige-dark">New sensor data is available for sync.</p>
                </div>
              </div>
            </div>

            {/* Empty States */}
            <div id="empty-states" className="space-y-8 scroll-mt-8">
              <h3 className="text-xl font-extrabold text-text flex items-center gap-2">
                <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                Empty States
              </h3>
              <Card className="p-12">
                <EmptyState
                  title="No projects found"
                  subtitle="Get started by creating your first workspace optimization project."
                  ctaLabel="Create Project"
                  onCta={() => console.log("Create project clicked")}
                />
              </Card>
            </div>
          </div>
        </section>

        {/* Organisms Section */}
        <section id="organisms" className="mb-24 scroll-mt-8">
          <h2 className="text-3xl font-extrabold text-text mb-2">3. Organisms</h2>
          <p className="text-text-muted mb-12">Complex UI components composed of molecules and/or atoms.</p>

          <div className="space-y-16">
            {/* Dashboard Header */}
            <div id="dashboard-header" className="space-y-8 scroll-mt-8">
              <h3 className="text-xl font-extrabold text-text flex items-center gap-2">
                <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                Dashboard Header
              </h3>
              <div className="w-full bg-surface border border-border p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                <div>
                  <h4 className="text-2xl font-extrabold text-text mb-1 font-manrope">Good Morning, Kari</h4>
                  <p className="text-sm text-text-muted">Here is what&apos;s happening in your workspace today.</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="secondary" size="sm">Download Report</Button>
                  <Button variant="primary" size="sm">Create Project</Button>
                </div>
              </div>
            </div>

            {/* Sidebar Navigation */}
            <div id="sidebar-navigation" className="space-y-8 scroll-mt-8">
              <h3 className="text-xl font-extrabold text-text flex items-center gap-2">
                <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                Sidebar Navigation
              </h3>
              <div className="w-64 bg-surface border border-border rounded-2xl p-6 space-y-8 shadow-sm">
                <Logo size="md" />
                <nav className="space-y-1">
                  {[
                    { label: "Dashboard", icon: LayoutDashboard, active: true },
                    { label: "Analytics", icon: BarChart3 },
                    { label: "Floor Plans", icon: Map },
                    { label: "Team", icon: Users },
                    { label: "Settings", icon: Settings },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${item.active ? "bg-primary/10 text-primary" : "text-text-muted hover:bg-background-alt hover:text-text"
                        }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </div>
                  ))}
                </nav>
              </div>
            </div>

            {/* Data Table */}
            <div id="data-table" className="space-y-8 scroll-mt-8">
              <h3 className="text-xl font-extrabold text-text flex items-center gap-2">
                <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                Data Table
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Occupancy</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: "Oslo Headquarters", status: "active", occupancy: "84%", id: 1 },
                    { name: "Stockholm Studio", status: "pending", occupancy: "62%", id: 2 },
                    { name: "Copenhagen Hub", status: "archived", occupancy: "45%", id: 3 },
                  ].map((row) => (
                    <TableRow key={row.id} className="group">
                      <TableCell className="text-text">{row.name}</TableCell>
                      <TableCell>
                        <Badge variant={row.status as "active" | "pending" | "archived"}>{row.status}</Badge>
                      </TableCell>
                      <TableCell className="tabular-nums">{row.occupancy}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Manage</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
                {/* Table style guidelines */}
                <div className="mt-8 space-y-4">
                  <div>
                    <p className="text-xs font-bold text-text-muted tracking-wider mb-1">Standard Table Guidelines</p>
                    <p className="text-sm text-text-muted font-body">All tables share one visual language (see <code className="font-mono text-primary">DESIGN.md → Table Design Standard</code>): wrapper <code className="font-mono text-primary">rounded-2xl border border-border bg-surface</code>, header <code className="font-mono text-primary">bg-surface-2</code> with bold near-black <code className="font-mono text-primary">text-[13px] font-bold text-text tracking-wider font-body</code>, body cells <code className="font-mono text-primary">text-sm text-text-muted font-body</code> — never bold, all columns one font size (name cell may use <code className="font-mono text-primary">text-text</code> for color), <code className="font-mono text-primary">divide-y divide-border</code> horizontal dividers only — <strong>never</strong> vertical column borders, no icons inside cells, hover <code className="font-mono text-primary">hover:bg-[#FFFDFA]</code>. Padding: <code className="font-mono text-primary">px-5 py-4</code> comfortable / <code className="font-mono text-primary">px-4 py-3</code> compact.</p>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Round</TableHead>
                        <TableHead>Count</TableHead>
                        <TableHead className="text-right">Conducted by</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { date: "Apr 22, 2024", round: "Round 1", count: "12", by: "John K." },
                        { date: "Apr 22, 2024", round: "Round 2", count: "8",  by: "Sarah L." },
                        { date: "Apr 23, 2024", round: "Round 1", count: "15", by: "John K." },
                      ].map((row, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-text">{row.date}</TableCell>
                          <TableCell>{row.round}</TableCell>
                          <TableCell className="tabular-nums">{row.count}</TableCell>
                          <TableCell className="text-right">{row.by}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
            </div>

            {/* Feature organisms catalog */}
            <div className="space-y-6 scroll-mt-8">
              <h3 className="text-xl font-extrabold text-text flex items-center gap-2">
                <div className="w-1.5 h-6 bg-primary rounded-full" />
                Feature organisms
              </h3>
              <p className="text-sm text-text-muted font-body -mt-2">Stateful, feature-level components — explore them live in the app.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "AppLayout", path: "components/layout/AppLayout", desc: "Sticky top-nav shell wrapping all post-auth pages." },
                  { name: "WorkplaceJourneyBar", path: "components/ui/WorkplaceJourneyBar", desc: "Seven-step workplace journey progress bar." },
                  { name: "PotentialScoreWidget", path: "components/ui/PotentialScoreWidget", desc: "Workspace potential-score widget." },
                  { name: "FloorCanvas", path: "components/canvas/FloorCanvas", desc: "Konva floor-plan editor: pen / select / zone / eraser." },
                  { name: "GuideOverlay", path: "components/canvas/GuideOverlay", desc: "Step-by-step canvas tutorial overlay." },
                  { name: "DetailPanel", path: "components/canvas/DetailPanel", desc: "Selected-room detail & edit side panel." },
                  { name: "RoomModal", path: "components/canvas/RoomModal", desc: "Zone-assignment modal." },
                  { name: "SurveyModal", path: "components/canvas/SurveyModal", desc: "Launch-survey modal." },
                  { name: "CompletionModal", path: "components/canvas/CompletionModal", desc: "Floor-completion modal." },
                  { name: "ScoreWidget", path: "components/canvas/ScoreWidget", desc: "In-canvas score widget." },
                  { name: "IllustrationDrawRoom", path: "components/canvas/IllustrationDrawRoom", desc: "Draw-room illustration." },
                ].map((c) => <CatalogCard key={c.name} {...c} />)}
              </div>
            </div>
          </div>
        </section>

        {/* Templates Section */}
        <section id="templates" className="mb-24 scroll-mt-8">
          <h2 className="text-3xl font-extrabold text-text mb-2">4. Templates</h2>
          <p className="text-text-muted mb-12">Page-level layouts and multi-step flows.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "AppLayout shell", path: "components/layout/AppLayout", desc: "Top-nav + scrollable content frame for every post-auth page." },
              { name: "Onboarding · Project", path: "components/onboarding/Step1Project", desc: "Step 1 — create project (name, location, category)." },
              { name: "Onboarding · Lease parameters", path: "components/onboarding/Step3Lease", desc: "Step 2 — lease params + live efficiency charts." },
              { name: "Onboarding · Floor plans", path: "components/onboarding/Step3FloorPlans", desc: "Step 3 — upload floor plans (or skip)." },
              { name: "Onboarding · Done", path: "components/onboarding/Step6Done", desc: "Completion step — potential score reveal." },
            ].map((c) => <CatalogCard key={c.name} {...c} />)}
          </div>
        </section>

        {/* Pages Section */}
        <section id="pages" className="mb-24 scroll-mt-8">
          <h2 className="text-3xl font-extrabold text-text mb-2">5. Pages</h2>
          <p className="text-text-muted mb-12">Final routes that compose templates and organisms into real screens.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Dashboard", path: "app/dashboard", desc: "Stats, activity feed, recent projects." },
              { name: "Projects", path: "app/project", desc: "Projects list grid." },
              { name: "Project detail", path: "app/project/[id]", desc: "Overview / Floors / Team tabs." },
              { name: "Canvas", path: "app/project/[id]/floor/[floorId]", desc: "Konva floor-plan editor + guide." },
              { name: "Room counting", path: "…/floor/[floorId]/count", desc: "Room setup, session details & counting." },
              { name: "Counting history", path: "…/floor/[floorId]/history", desc: "Charts + session records." },
              { name: "Surveys", path: "app/surveys", desc: "Survey list + detail." },
              { name: "Members", path: "app/team", desc: "Team management." },
              { name: "Onboarding", path: "app/onboarding", desc: "Multi-step setup wizard." },
              { name: "Auth", path: "app/(auth)", desc: "Sign up / in, verify, password, org details." },
            ].map((c) => <CatalogCard key={c.name} {...c} />)}
          </div>
        </section>

        <footer className="mt-32 pt-8 border-t border-border flex justify-between items-center text-text-muted text-sm">
          <p>© 2026 AreaSim NEXT. Design System Documentation.</p>
          <div className="flex gap-6">
            <button className="hover:text-primary transition-colors">Documentation</button>
            <button className="hover:text-primary transition-colors">GitHub</button>
          </div>
        </footer>
      </main>
    </div>
  );
}

// ─── Component catalog card ────────────────────────────────────────────────────

function CatalogCard({ name, path, desc }: { name: string; path: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 hover:border-primary/30 hover:shadow-card transition-all">
      <p className="text-sm font-extrabold text-text" style={{ fontFamily: "var(--font-manrope)" }}>{name}</p>
      <p className="text-xs text-text-muted font-body mt-1 leading-relaxed">{desc}</p>
      <code className="inline-block mt-3 text-[11px] font-mono text-primary break-all">{path}</code>
    </div>
  );
}

// ─── Input demo sub-components ─────────────────────────────────────────────────

function PasswordFieldDemo() {
  const [show, setShow] = useState(false);
  return (
    <Input
      label="Password Field"
      type={show ? "text" : "password"}
      defaultValue="SuperSecret99"
      icon={
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="text-[#98A1B2] hover:text-[#139485] transition-colors"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      }
      iconPosition="right"
      onIconClick={() => setShow((v) => !v)}
    />
  );
}

function CounterFieldDemo() {
  const [val, setVal] = useState("");
  return (
    <Input
      label="Input with Counter"
      placeholder="Write something (max 120 chars)…"
      value={val}
      onChange={(e) => setVal(e.target.value)}
      counter
      maxLength={120}
      hint="Character counter updates as you type."
    />
  );
}

function SelectFieldDemo({
  label,
  hasError,
  isDisabled,
  fieldSize = "md",
}: {
  label: string;
  hasError?: boolean;
  isDisabled?: boolean;
  fieldSize?: "sm" | "md" | "lg";
}) {
  const heights: Record<string, string> = { sm: "h-9 text-xs px-4", md: "h-11 text-sm px-5", lg: "h-14 text-base px-6" };
  const labelSize: Record<string, string> = { sm: "text-xs", md: "text-[13px]", lg: "text-sm" };
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className={cn("font-semibold text-[#222B27] font-body", labelSize[fieldSize])}>{label}</label>
      <div className="relative">
        <select
          disabled={isDisabled}
          className={cn(
            "w-full appearance-none rounded-xl border border-[#969696] bg-white text-[#222B27]",
            "transition-all duration-200 pr-10 cursor-pointer",
            "hover:border-[#999999] hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)]",
            "focus:outline-none focus:border-[#139485] focus:ring-4 focus:ring-[rgba(19,148,133,0.18)]",
            "disabled:bg-[#F5F5F5] disabled:border-[#E2E2E2] disabled:opacity-60 disabled:cursor-not-allowed",
            hasError && "border-[#D47A1F] focus:border-[#D47A1F] focus:ring-[rgba(212,122,31,0.18)]",
            heights[fieldSize]
          )}
          defaultValue=""
        >
          <option value="" disabled>Select an option…</option>
          <option>Meeting Room</option>
          <option>Focus Area</option>
          <option>Social Zone</option>
          <option>Storage</option>
        </select>
        <ChevronDown
          size={fieldSize === "sm" ? 13 : fieldSize === "lg" ? 17 : 15}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#98A1B2] pointer-events-none"
        />
      </div>
      {hasError && <p className="text-xs text-[#D47A1F] font-body">Please select an option.</p>}
    </div>
  );
}

const ALL_OPTIONS = ["Meeting", "Focus", "Social", "Lounge", "Storage", "Reception", "Phone Booth"];

function MultiSelectDemo() {
  const [selected, setSelected] = useState<string[]>(["Meeting", "Focus"]);
  const [isOpen, setIsOpen] = useState(false);

  const toggle = (opt: string) => {
    setSelected((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
    );
  };
  const remove = (opt: string) => setSelected((prev) => prev.filter((o) => o !== opt));

  return (
    <div className="max-w-lg">
      <label className="text-[13px] font-semibold text-[#222B27] font-body block mb-1.5">Room Categories</label>

      {/* Token display + dropdown trigger */}
      <div
        className={cn(
          "min-h-11 w-full rounded-xl border-[1.5px] border-[#B8B8B8] bg-white px-4 py-2 flex flex-wrap items-center gap-1.5 cursor-pointer transition-all duration-200",
          "hover:border-[#999999] hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)]",
          isOpen && "border-[#139485] ring-4 ring-[rgba(19,148,133,0.18)]"
        )}
        onClick={() => setIsOpen((v) => !v)}
      >
        {selected.length === 0 && (
          <span className="text-sm text-[#98A1B2]">Select categories…</span>
        )}
        {selected.map((opt) => (
          <span
            key={opt}
            className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#EAF5EE] text-[#139485] text-xs font-semibold"
            onClick={(e) => { e.stopPropagation(); remove(opt); }}
          >
            {opt}
            <XIcon size={11} className="opacity-60 hover:opacity-100" />
          </span>
        ))}
        <ChevronDown
          size={14}
          className={cn("ml-auto text-[#98A1B2] transition-transform shrink-0", isOpen && "rotate-180")}
        />
      </div>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="mt-2 bg-white border border-[#E2E8F0] rounded-2xl shadow-lg overflow-hidden">
          {ALL_OPTIONS.map((opt) => {
            const isSelected = selected.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggle(opt)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors text-left",
                  isSelected ? "bg-[#EAF5EE] text-[#139485] font-semibold" : "text-[#222B27] hover:bg-[#F8FAFC]"
                )}
              >
                {opt}
                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-[#139485] flex items-center justify-center">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4L3 5.5L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
      <p className="text-xs text-[#98A1B2] font-body mt-1.5">
        {selected.length} of {ALL_OPTIONS.length} selected · Click tokens to remove
      </p>
    </div>
  );
}

// ─── Color / Usage boxes ────────────────────────────────────────────────────────

function ColorBox({ hex, name, isMain }: { hex: string; name: string; isMain?: boolean }) {
  return (
    <div className="space-y-1 group">
      <div
        className={cn(
          "h-10 w-full rounded-lg border border-black/5 shadow-sm transition-transform group-hover:scale-[1.02] flex items-end p-1.5",
          isMain && "ring-2 ring-primary ring-offset-2"
        )}
        style={{ backgroundColor: hex }}
      >
        {isMain && (
          <span className="bg-white/90 backdrop-blur-sm text-[7px] font-bold px-1 py-0.5 rounded tracking-tighter shadow-sm">
            Main
          </span>
        )}
      </div>
      <div>
        <p className="text-[10px] font-bold text-text truncate leading-none">{name}</p>
        <p className="text-[8px] text-text-muted font-mono">{hex}</p>
      </div>
    </div>
  );
}

function UsageGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h4 className="text-xs font-extrabold text-text tracking-widest border-b border-border pb-2">{title}</h4>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

function UsageItem({ label, color, token }: { label: string; color: string; token: string }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <div
          className="w-4 h-4 rounded-full border border-black/5 shadow-inner"
          style={{ backgroundColor: color }}
        ></div>
        <span className="text-xs font-medium text-text-muted group-hover:text-text transition-colors">{label}</span>
      </div>
      <div className="text-right">
        <p className="text-[9px] font-bold text-text tracking-tighter">{token}</p>
        <p className="text-[8px] text-text-muted font-mono leading-none">{color}</p>
      </div>
    </div>
  );
}
