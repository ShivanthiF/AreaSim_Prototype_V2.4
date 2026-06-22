"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({ fullName: "", workEmail: "" });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    sessionStorage.setItem("signup-email", values.workEmail);
    await new Promise((r) => setTimeout(r, 700));
    router.push("/verify-email");
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* White card */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-[#ECECEC] shadow-sm p-8 space-y-6">
        <div>
          <h1 className="text-2xl text-text mb-1" style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}>
            Create your account
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full name" placeholder="Ingrid Larsen" icon={<User size={16} />}
            value={values.fullName} onChange={handleChange("fullName")} />
          <Input label="Work email" type="email" placeholder="ingrid@company.no" icon={<Mail size={16} />}
            value={values.workEmail} onChange={handleChange("workEmail")} />

          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center shrink-0 mt-0.5">
              <input
                type="checkbox"
                className="peer w-4 h-4 rounded border-2 border-[#AEAEAE] bg-surface appearance-none cursor-pointer checked:bg-primary checked:border-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <svg className="absolute inset-0 w-4 h-4 text-white pointer-events-none hidden peer-checked:block" viewBox="0 0 16 16" fill="none">
                <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-sm text-text-muted font-body leading-relaxed">
              I hereby confirm that I have read and agree with the{" "}
              <a href="#" className="text-primary hover:underline font-medium" onClick={(e) => e.stopPropagation()}>terms of service</a>
              {" "}and{" "}
              <a href="#" className="text-primary hover:underline font-medium" onClick={(e) => e.stopPropagation()}>privacy policy</a>.
            </span>
          </label>

          <div className="flex justify-center my-6">
            <Button type="submit" size="lg" loading={loading} className="w-full">
              Continue with email
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
        Already have an account?{" "}
        <Link href="/signin" className="text-primary hover:underline font-medium">Sign in</Link>
      </motion.p>
    </motion.div>
  );
}
