import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { VedaLogo } from "@/components/layout/veda-logo";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;

  if (session?.user) {
    redirect(params.callbackUrl ?? "/assignments");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-workspace px-4">
      <div className="w-full max-w-md rounded-3xl border border-border/80 bg-card p-8 shadow-sm sm:p-10">
        <div className="flex justify-center">
          <VedaLogo href="/" />
        </div>
        <h1 className="mt-8 text-center text-2xl font-bold tracking-tight">
          Welcome back
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Sign in with Google to access your assignments across devices.
        </p>

        <form
          className="mt-8"
          action={async () => {
            "use server";
            await signIn("google", {
              redirectTo: params.callbackUrl ?? "/assignments",
            });
          }}
        >
          <Button
            type="submit"
            className="h-12 w-full cursor-pointer rounded-2xl bg-[#1a1a1a] text-base text-white hover:bg-[#2a2a2a]"
          >
            Continue with Google
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing, you agree to use VedaAI for educational assessment
          creation.
        </p>

        <p className="mt-4 text-center text-sm">
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
