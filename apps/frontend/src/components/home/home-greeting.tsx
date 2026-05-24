"use client";

import { useSession } from "next-auth/react";
import { getUserFirstName } from "@/lib/user-display";

export function HomeGreeting() {
  const { data: session } = useSession();
  const firstName = getUserFirstName(session?.user?.name);

  return (
    <header className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-orange-600/90">
        Workspace
      </p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {firstName ? `Good to see you, ${firstName}` : "Welcome back"}
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Pick up where you left off, start from a template, or upload a syllabus
        to generate your next paper.
      </p>
    </header>
  );
}
