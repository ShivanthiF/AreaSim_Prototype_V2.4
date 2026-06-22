"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Hash } from "lucide-react";
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

export default function OrganizationDetailsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({ organization: "", organizationNumber: "" });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    router.push("/welcome");
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
      {/* White card */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-[#ECECEC] shadow-sm p-8 space-y-6">
        <div>
          <h1 className="text-2xl text-text mb-1" style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}>
            Your organisation
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Organization number" placeholder="e.g. 123 456 789"
            icon={<Hash size={16} />} value={values.organizationNumber} onChange={handleChange("organizationNumber")} />
          <Input label="Organization name" placeholder="Larsen & Partners AS"
            icon={<Building2 size={16} />} value={values.organization} onChange={handleChange("organization")} />

          <div className="flex justify-center">
            <Button type="submit" size="lg" loading={loading} className="w-full">
              Get started
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
