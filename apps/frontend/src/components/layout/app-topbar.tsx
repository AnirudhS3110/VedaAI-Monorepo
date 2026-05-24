"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Bell, LayoutGrid } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/layout/user-avatar";
import { VedaLogo } from "@/components/layout/veda-logo";
import { useMobileNav } from "@/components/layout/mobile-nav-context";
import { TopbarMenuIcon } from "@/components/layout/topbar-menu-icon";
import {
  getDesktopBreadcrumb,
  getMobileTopbarConfig,
  shouldShowDesktopBack,
} from "@/lib/mobile-topbar";
import { mobileUi } from "@/lib/mobile-ui";
import { cn } from "@/lib/utils";

function MobilePageTitleBar({
  title,
  backHref,
  onBack,
}: {
  title: string;
  backHref?: string;
  onBack?: () => void;
}) {
  const backControl = backHref ? (
    <Link href={backHref} className={mobileUi.backButton} aria-label="Go back">
      <ArrowLeft className="size-5" />
    </Link>
  ) : onBack ? (
    <button
      type="button"
      onClick={onBack}
      className={mobileUi.backButton}
      aria-label="Go back"
    >
      <ArrowLeft className="size-5" />
    </button>
  ) : (
    <span className="size-10 shrink-0" aria-hidden />
  );

  return (
    <div
      className={cn(
        "relative flex h-12 items-center px-1",
        mobileUi.pageTitleBar,
      )}
    >
      {backControl}
      <h1 className="pointer-events-none absolute inset-x-12 truncate text-center text-base font-semibold text-foreground">
        {title}
      </h1>
    </div>
  );
}

function TopbarActions({
  status,
  session,
  displayName,
  onOpenMenu,
  showMenu,
}: {
  status: string;
  session: ReturnType<typeof useSession>["data"];
  displayName: string;
  onOpenMenu: () => void;
  showMenu: boolean;
}) {
  return (
    <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="touch-manipulation tap-highlight-none relative size-10 cursor-pointer rounded-full text-foreground active:bg-muted/80 lg:hover:bg-muted/80"
        aria-label="Notifications"
      >
        <Bell className="size-[22px]" strokeWidth={1.75} />
        <span className="absolute right-2.5 top-2 size-2 rounded-full bg-orange-500 ring-2 ring-white" />
      </Button>

      <button
        type="button"
        className={cn(
          "touch-manipulation tap-highlight-none flex cursor-pointer items-center rounded-full p-0.5 transition-colors active:bg-muted/80 lg:hover:bg-muted/80",
          "lg:gap-2 lg:rounded-xl lg:px-2 lg:py-1.5",
        )}
        aria-label="Account"
      >
        {status === "loading" ? (
          <span className="size-9 animate-pulse rounded-full bg-muted" />
        ) : (
          <UserAvatar
            name={session?.user?.name}
            image={session?.user?.image}
            className="size-9 ring-2 ring-border/40"
          />
        )}
        <span className="hidden max-w-[140px] truncate text-sm font-medium lg:inline">
          {displayName}
        </span>
      </button>

      {showMenu && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="touch-manipulation tap-highlight-none size-10 cursor-pointer rounded-full text-foreground active:bg-muted/80 lg:hover:bg-muted/80"
          onClick={onOpenMenu}
          aria-label="Open menu"
        >
          <TopbarMenuIcon />
        </Button>
      )}
    </div>
  );
}

export function AppTopbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { openDrawer } = useMobileNav();

  const mobileConfig = getMobileTopbarConfig(pathname);
  const desktopBreadcrumb = getDesktopBreadcrumb(pathname);
  const showDesktopBack = shouldShowDesktopBack(pathname);

  const displayName =
    status === "loading" ? "Loading…" : (session?.user?.name ?? "Account");

  const actions = (
    <TopbarActions
      status={status}
      session={session}
      displayName={displayName}
      onOpenMenu={openDrawer}
      showMenu
    />
  );

  return (
    <header
      className={cn(
        "z-30 shrink-0",
        "pt-[env(safe-area-inset-top)]",
        "max-lg:bg-transparent max-lg:pb-1",
        "lg:static lg:bg-transparent",
      )}
    >
      {/* ——— Mobile ——— */}
      <div
        className={cn(
          "lg:hidden",
          mobileUi.shellInsetX,
          mobileUi.shellInsetTop,
        )}
      >
        {mobileConfig.variant === "tab-root" || mobileConfig.variant === "inner" ? (
          <>
            <div className={mobileUi.topBarShell}>
              <div className="flex h-14 items-center justify-between gap-3 px-4">
                <VedaLogo showWordmark compact className="min-w-0 shrink" />
                {actions}
              </div>
            </div>
            {mobileConfig.title && (
              <MobilePageTitleBar
                title={mobileConfig.title}
                backHref={
                  mobileConfig.variant === "tab-root"
                    ? mobileConfig.backHref
                    : undefined
                }
                onBack={
                  mobileConfig.variant === "inner"
                    ? () => router.back()
                    : undefined
                }
              />
            )}
          </>
        ) : (
          <div className={mobileUi.topBarShell}>
            <div className="flex h-14 items-center justify-between gap-3 px-4">
              <VedaLogo showWordmark compact className="min-w-0 shrink" />
              {actions}
            </div>
          </div>
        )}
      </div>

      {/* ——— Desktop (unchanged layout) ——— */}
      <div
        className={cn(
          "hidden h-16 items-center justify-between gap-3 rounded-2xl border-b border-border/50",
          "bg-card/80 px-8 backdrop-blur-sm lg:flex",
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {showDesktopBack && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="cursor-pointer rounded-xl"
              onClick={() => router.back()}
              aria-label="Go back"
            >
              <ArrowLeft className="size-5" />
            </Button>
          )}
          <div className="flex min-w-0 items-center gap-2 text-sm font-medium text-foreground">
            <LayoutGrid className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{desktopBreadcrumb}</span>
          </div>
        </div>

        <TopbarActions
          status={status}
          session={session}
          displayName={displayName}
          onOpenMenu={openDrawer}
          showMenu={false}
        />
      </div>
    </header>
  );
}
