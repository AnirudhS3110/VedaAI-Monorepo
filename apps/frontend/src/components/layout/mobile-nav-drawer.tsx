"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMobileNav } from "./mobile-nav-context";
import { SidebarNavContent } from "./sidebar-nav-content";

export function MobileNavDrawer() {
  const { isDrawerOpen, closeDrawer } = useMobileNav();

  useEffect(() => {
    if (!isDrawerOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDrawer();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isDrawerOpen, closeDrawer]);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 lg:hidden"
            aria-label="Close menu"
            onClick={closeDrawer}
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
            className="fixed inset-y-0 right-0 z-50 flex w-[min(300px,88vw)] flex-col overflow-y-auto overscroll-contain bg-card px-4 py-5 shadow-2xl lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="mb-4 flex items-center justify-end">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-9 rounded-xl"
                onClick={closeDrawer}
                aria-label="Close menu"
              >
                <X className="size-5" />
              </Button>
            </div>

            <SidebarNavContent
              onNavigate={closeDrawer}
              activeLayoutId="mobile-drawer-active"
              className="min-h-0 flex-1"
            />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
