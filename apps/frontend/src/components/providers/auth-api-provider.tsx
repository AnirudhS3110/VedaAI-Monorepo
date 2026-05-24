"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { setApiUserId } from "@/lib/api/auth-headers";

export function AuthApiProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    // Don't mutate apiUserId while the session is still loading.
    // Previously this would fall through to setApiUserId(null) during the
    // loading window on page refresh, causing API requests to go out without
    // an X-User-Id header and receiving 401s.
    if (status === "loading") return;

    if (status === "authenticated" && session?.user?.id) {
      setApiUserId(session.user.id);
    } else {
      setApiUserId(null);
    }
  }, [session?.user?.id, status]);

  return children;
}
