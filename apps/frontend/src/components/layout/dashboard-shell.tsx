"use client";

import { mobileUi } from "@/lib/mobile-ui";
import { responsiveLayout } from "@/lib/responsive-layout";
import { cn } from "@/lib/utils";
import { AppSidebar } from "./app-sidebar";
import { AppTopbar } from "./app-topbar";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { MobileCreateFab } from "./mobile-create-fab";
import { MobileNavDrawer } from "./mobile-nav-drawer";
import { MobileNavProvider } from "./mobile-nav-context";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <MobileNavProvider>
      <div
        className={cn(
          "flex h-dvh min-h-0 overflow-hidden overflow-x-hidden bg-workspace",
          mobileUi.shellBackground,
        )}
      >
        <div className="hidden h-full shrink-0 lg:flex">
          <AppSidebar />
        </div>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden lg:gap-0">
          <AppTopbar />

          <main
            className={cn(
              responsiveLayout.mainScroll,
              mobileUi.shellInsetX,
              "pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:px-0 lg:pb-0",
            )}
          >
            {children}
          </main>
        </div>

        <MobileBottomNav />
        <MobileCreateFab />
        <MobileNavDrawer />
      </div>
    </MobileNavProvider>
  );
}
