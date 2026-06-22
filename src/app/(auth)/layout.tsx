import Image from "next/image";
import { LanguageSelector } from "@/components/ui/LanguageSelector";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-1/3 relative overflow-hidden shrink-0 bg-surface">
        <Image
          src="/Signup_Illustration.svg"
          alt="AreaSim Illustration"
          fill
          className="object-cover"
        />
      </div>

      {/* Form panel */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-end px-6 py-5 border-b border-border lg:border-0">
          <div className="ml-auto">
            <LanguageSelector />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
