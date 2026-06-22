"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

const OTP_LENGTH = 6;

export default function VerifyEmailPage() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [email, setEmail] = useState("your email");
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("signup-email");
    if (stored) setEmail(stored);
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const char = value.slice(-1);
    const next = [...otp];
    next[index] = char;
    setOtp(next);
    if (char && index < OTP_LENGTH - 1) refs.current[index + 1]?.focus();
    if (next.every((d) => d !== "")) handleVerify();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) refs.current[index - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (pasted) {
      const next = pasted.split("").concat(Array(OTP_LENGTH).fill("")).slice(0, OTP_LENGTH);
      setOtp(next);
      refs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
    }
  };

  const handleVerify = () => {
    if (verifying) return;
    setVerifying(true);
    setTimeout(() => router.push("/create-password"), 400);
  };

  return (
    <div className="space-y-4">
      {/* White card */}
      <div className="bg-white rounded-2xl border border-[#ECECEC] shadow-sm p-8 space-y-8 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }} className="flex justify-center">
          <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl shadow-[#139485]/10 bg-brand-gradient">
            <Mail size={36} color="#139485" />
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h1 className="text-2xl text-text mb-2" style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}>
            Check your inbox
          </h1>
          <p className="text-sm text-text-muted font-body">
            We&apos;ve sent a 6-digit code to <span className="text-text font-medium">{email}</span>
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2.5" onPaste={handlePaste}>
          {Array.from({ length: OTP_LENGTH }).map((_, i) => (
            <Input key={i} ref={(el) => { refs.current[i] = el; }} type="text" inputMode="numeric"
              maxLength={1} value={otp[i]} onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={cn(
                "w-12 h-14 text-center text-xl rounded-xl border bg-white text-[#222B27] px-0 transition-all duration-200",
                otp[i]
                  ? "border-[#139485] ring-4 ring-[rgba(19,148,133,0.18)]"
                  : "border-[#969696] hover:border-[#999999]"
              )}
              style={{ fontFamily: "var(--font-jetbrains-mono)", fontWeight: 600 }}
            />
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="flex justify-center">
          <Button size="lg" onClick={() => handleVerify()} loading={verifying} className="w-full">
            Verify email
          </Button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          {canResend ? (
            <button onClick={() => { setCountdown(60); setCanResend(false); setOtp(Array(OTP_LENGTH).fill("")); }}
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-body font-medium">
              <RefreshCw size={13} /> Resend code
            </button>
          ) : (
            <p className="text-sm text-text-muted font-body">
              Resend in <span className="font-body text-text font-medium">
                {String(Math.floor(countdown / 60)).padStart(2, "0")}:{String(countdown % 60).padStart(2, "0")}
              </span>
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
