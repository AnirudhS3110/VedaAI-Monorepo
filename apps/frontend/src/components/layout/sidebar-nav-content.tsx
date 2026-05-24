"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, Plus, Sparkles } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  bottomNavItems,
  mainNavItems,
} from "@/constants/navigation";
import { isNavActive } from "@/lib/nav-utils";
import { useAssignmentsStore } from "@/stores/assignments-store";
import { cn } from "@/lib/utils";
import { UserAvatar } from "./user-avatar";
import { VedaLogo } from "./veda-logo";

interface SidebarNavContentProps {
  /** Called after navigation (e.g. close mobile drawer) */
  onNavigate?: () => void;
  showLogo?: boolean;
  showCreateButton?: boolean;
  className?: string;
  /** Unique layoutId prefix to avoid conflicts between desktop sidebar and drawer */
  activeLayoutId?: string;
}

export function SidebarNavContent({
  onNavigate,
  showLogo = true,
  showCreateButton = true,
  className,
  activeLayoutId = "sidebar-active",
}: SidebarNavContentProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const assignmentCount = useAssignmentsStore((s) => s.items.length);

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {showLogo && (
        <VedaLogo className="px-1" href="/home" onNavigate={onNavigate} />
      )}

      {showCreateButton && (
        <div className="mt-6 px-1">
          <Button
            asChild
            className="h-11 w-full rounded-2xl bg-[#1a1a1a] text-sm font-medium text-white shadow-[0_0_0_1px_rgba(249,115,22,0.35),0_8px_24px_rgba(0,0,0,0.12)] hover:bg-[#2a2a2a]"
          >
            <Link href="/assignments/create" onClick={onNavigate}>
              <Plus className="size-4" />
              Create Assignment
              <Sparkles className="ml-auto size-3.5 opacity-80" />
            </Link>
          </Button>
        </div>
      )}

      <nav className="mt-6 flex flex-1 flex-col gap-1 overflow-y-auto px-1">
        {mainNavItems.map((item) => {
          const active = !item.disabled && isNavActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.disabled ? "#" : item.href}
              aria-disabled={item.disabled}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                item.disabled && "pointer-events-none opacity-40",
                active
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              {active && (
                <motion.span
                  layoutId={activeLayoutId}
                  className="absolute inset-0 rounded-xl bg-muted"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {item.iconSrc ? (
                <Image
                  src={item.iconSrc}
                  alt=""
                  width={18}
                  height={18}
                  className="relative z-10 size-[18px] shrink-0"
                  aria-hidden
                />
              ) : (
                <Icon className="relative z-10 size-[18px] shrink-0" />
              )}
              <span className="relative z-10 flex-1">{item.label}</span>
              {item.label === "Assignments" && assignmentCount > 0 && (
                <span className="relative z-10 rounded-full bg-orange-500 px-2 py-0.5 text-xs font-semibold text-white">
                  {assignmentCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1 px-1 pb-1">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.disabled ? "#" : item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground",
                item.disabled && "pointer-events-none opacity-40",
              )}
            >
              <Icon className="size-[18px]" />
              {item.label}
            </Link>
          );
        })}

        <div className="mt-3 rounded-2xl bg-muted/80 p-3">
          <div className="flex items-center gap-3">
            <UserAvatar
              name={session?.user?.name}
              image={session?.user?.image}
              size="md"
              className="size-10"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {session?.user?.name ?? "Signed in"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {session?.user?.email ?? "Signed in with Google"}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            className="mt-2 h-9 w-full cursor-pointer justify-start gap-2 rounded-xl text-xs text-muted-foreground"
            onClick={() => void signOut({ callbackUrl: "/" })}
          >
            <LogOut className="size-3.5" />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
