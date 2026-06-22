"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const inputCls =
  "w-full rounded-xl border border-[#D1D1D1] bg-white pl-10 pr-4 py-2.5 text-sm text-[#222B27] font-body placeholder:text-[#98A1B2] " +
  "hover:border-[#999999] hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)] " +
  "focus:outline-none focus:border-[#139485] focus:ring-4 focus:ring-[rgba(19,148,133,0.18)] " +
  "transition-all duration-200";

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    router.push("/dashboard");
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
      {/* White card */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-[#ECECEC] shadow-sm p-8 space-y-6">
        <div>
          <h1 className="text-2xl text-text mb-1" style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}>
            Welcome back
          </h1>
          <p className="text-sm text-text-muted font-body">Sign in to your AreaSim account to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text font-body">Work email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              <input type="email" placeholder="ingrid@company.no" required value={email}
                onChange={(e) => setEmail(e.target.value)} className={inputCls} />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-text font-body">Password</label>
              <a href="#" className="text-xs text-primary hover:underline font-medium font-body">Forgot password?</a>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              <input type={showPassword ? "text" : "password"} placeholder="Enter your password" required
                value={password} onChange={(e) => setPassword(e.target.value)}
                className={`${inputCls} pr-10`} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <Button type="submit" size="lg" loading={loading} icon={<ArrowRight size={16} />} iconPosition="right" className="w-full">
              Sign in
            </Button>
          </div>
        </form>

        <div className="relative flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-text-muted font-body">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          icon={
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
            </svg>
          }
        >
          Continue with Google
        </Button>
      </motion.div>

      <motion.p variants={itemVariants} className="text-center text-sm text-text-muted font-body">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary hover:underline font-medium">Sign up</Link>
      </motion.p>
    </motion.div>
  );
}
