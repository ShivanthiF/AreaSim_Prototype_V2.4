"use client";

import { User } from "lucide-react";

interface UserAvatarProps {
  onClick?: () => void;
}

/** Reusable profile avatar — purple gradient with User icon. Use wherever a user avatar is needed. */
export function UserAvatar({ onClick }: UserAvatarProps) {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 hover:opacity-80 transition-opacity"
      style={{ background: "linear-gradient(106deg, #E8E2F5 0%, #B8AFDF 100%)" }}
      title="Settings"
    >
      <User size={14} color="#6C62AA" />
    </button>
  );
}
