import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";
import { GoogleIcon } from "@/components/auth/google-icon";
import { LoginShell } from "@/components/auth/login-shell";
import { VedaLogo } from "@/components/layout/veda-logo";
import { cn } from "@/lib/utils";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;

  if (session?.user) {
    redirect(params.callbackUrl ?? "/home");
  }

  return (
    <LoginShell>
      <div
        className={cn(
          "rounded-2xl border border-border/70 bg-card/95 shadow-[0_8px_40px_rgba(0,0,0,0.07)]",
          "backdrop-blur-sm",
        )}
      >
        <div className="border-b border-border/50 px-6 py-5 sm:px-7">
          <div className="flex justify-center">
            <VedaLogo href="/" />
          </div>
        </div>

        <div className="px-6 py-6 sm:px-7 sm:py-7">
          <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-orange-600/90">
            Sign in
          </p>
          <h1 className="mt-3 text-center text-xl font-bold tracking-tight text-foreground sm:text-[1.35rem]">
            Welcome back
          </h1>
          <p className="mx-auto mt-2 max-w-[18rem] text-center text-sm leading-relaxed text-muted-foreground">
            Continue with Google to access assignments, generation, and exports
            across devices.
          </p>

          <form
            className="mt-6"
            action={async () => {
              "use server";
              await signIn("google", {
                redirectTo: params.callbackUrl ?? "/home",
              });
            }}
          >
            <button
              type="submit"
              className={cn(
                "group flex h-11 w-full cursor-pointer items-center justify-center gap-2.5 rounded-2xl",
                "bg-[#1a1a1a] text-sm font-medium text-white",
                "shadow-[0_4px_20px_rgba(0,0,0,0.12)]",
                "transition-[background,transform,box-shadow] duration-200",
                "hover:bg-[#2a2a2a] hover:shadow-[0_6px_24px_rgba(0,0,0,0.14)]",
                "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
                "active:scale-[0.99]",
              )}
            >
              <span className="flex size-5 items-center justify-center rounded-md bg-white shadow-sm">
                <GoogleIcon className="size-4" />
              </span>
              Continue with Google
            </button>
          </form>

          <p className="mt-5 text-center text-[11px] leading-relaxed text-muted-foreground/90">
            By continuing, you agree to use VedaAI for educational assessment
            creation.
          </p>
        </div>

        <div className="border-t border-border/50 px-6 py-4 text-center sm:px-7">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
          >
            ← Back to home
          </Link>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground/80">
        Production-grade AI assessment workflows
      </p>
    </LoginShell>
  );
}
