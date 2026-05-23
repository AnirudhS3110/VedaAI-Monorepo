"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { setApiUserId } from "@/lib/api/auth-headers";

export function AuthApiProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      setApiUserId(session.user.id);
      return;
    }
    if (status === "unauthenticated") {
      setApiUserId(null);
    }
  }, [session?.user?.id, status]);

  return children;
}
