import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
}

export function Logo({ size = "md", className }: LogoProps) {
  const heights = { sm: 24, md: 30, lg: 40 };
  const h = heights[size];
  const w = Math.round(h * (139 / 33));

  return (
    <Image
      src="/AreaSim New Logo - V1.svg"
      alt="AreaSim Logo"
      width={w}
      height={h}
      className={cn(className, "object-contain")}
      priority
    />
  );
}
