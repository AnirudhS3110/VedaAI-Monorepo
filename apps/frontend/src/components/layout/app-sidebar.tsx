"use client";

import { SidebarNavContent } from "./sidebar-nav-content";

export function AppSidebar() {
  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col rounded-r-2xl border-r border-border/60 bg-card px-4 py-5 shadow-sm">
      <SidebarNavContent activeLayoutId="desktop-sidebar-active" />
    </aside>
  );
}
