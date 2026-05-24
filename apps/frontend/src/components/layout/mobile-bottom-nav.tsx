"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { mobileBottomNavItems } from "@/constants/navigation";
import { mobileUi } from "@/lib/mobile-ui";
import { isNavActive } from "@/lib/nav-utils";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
      aria-label="Main navigation"
    >
      <div
        className={cn(
          "mx-auto flex max-w-lg items-center justify-around rounded-full bg-[#1a1a1a] px-2 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.28)]",
          mobileUi.bottomNavShadow,
        )}
      >
        {mobileBottomNavItems.map((item) => {
          const active = !item.disabled && isNavActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.disabled ? "#" : item.href}
              aria-current={active ? "page" : undefined}
              aria-disabled={item.disabled}
              className={cn(
                "touch-manipulation tap-highlight-none relative flex min-w-[4.5rem] flex-col items-center gap-1 rounded-full px-3 py-2 text-[10px] font-medium transition-[color,transform] active:scale-95",
                item.disabled && "pointer-events-none opacity-40",
                active ? "text-white" : "text-white/50",
              )}
            >
              {active && (
                <motion.span
                  layoutId="mobile-bottom-active"
                  className="absolute -top-0.5 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-white"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className="size-5 shrink-0" strokeWidth={active ? 2.25 : 1.75} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
