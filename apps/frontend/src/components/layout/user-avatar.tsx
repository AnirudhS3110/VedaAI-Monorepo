"use client";

import { getUserInitials } from "@/lib/user-display";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name?: string | null;
  image?: string | null;
  size?: "sm" | "md";
  className?: string;
}

const sizeClasses = {
  sm: "size-8 text-[10px]",
  md: "size-9 text-xs",
};

export function UserAvatar({
  name,
  image,
  size = "md",
  className,
}: UserAvatarProps) {
  const initials = getUserInitials(name);

  if (image) {
    return (
      <img
        src={image}
        alt=""
        className={cn(
          "shrink-0 rounded-full object-cover",
          sizeClasses[size],
          className,
        )}
      />
    );
  }

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 font-semibold text-white",
        sizeClasses[size],
        className,
      )}
    >
      {initials}
    </span>
  );
}
