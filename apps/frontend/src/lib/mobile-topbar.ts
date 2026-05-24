export type MobileTopbarVariant = "brand-only" | "tab-root" | "inner";

export interface MobileTopbarConfig {
  variant: MobileTopbarVariant;
  title?: string;
  backHref?: string;
}

const breadcrumbLabels: Record<string, string> = {
  home: "Home",
  assignments: "Assignments",
  create: "Create Assignment",
  generating: "Generating",
};

function getInnerTitle(pathname: string): string {
  if (pathname === "/home" || pathname === "/") {
    return "Home";
  }

  const segments = pathname.split("/").filter(Boolean);
  const last = segments[segments.length - 1];

  if (breadcrumbLabels[last]) {
    return breadcrumbLabels[last];
  }

  if (segments[0] === "assignments" && segments.length > 1) {
    return "Assignment";
  }

  return "Home";
}

export function getMobileTopbarConfig(pathname: string): MobileTopbarConfig {
  if (pathname === "/home" || pathname === "/") {
    return { variant: "brand-only" };
  }

  if (pathname === "/assignments") {
    return {
      variant: "tab-root",
      title: "Assignments",
      backHref: "/home",
    };
  }

  if (
    pathname === "/assignments/create" ||
    pathname.endsWith("/generating")
  ) {
    return {
      variant: "inner",
      title: getInnerTitle(pathname),
    };
  }

  if (/^\/assignments\/[^/]+$/.test(pathname)) {
    return { variant: "brand-only" };
  }

  if (pathname.startsWith("/assignments/")) {
    return {
      variant: "inner",
      title: getInnerTitle(pathname),
    };
  }

  return { variant: "brand-only" };
}

/** Desktop breadcrumb label in the top app bar */
export function getDesktopBreadcrumb(pathname: string): string {
  if (pathname === "/home" || pathname === "/") {
    return "Home";
  }
  return getInnerTitle(pathname);
}

export function shouldShowDesktopBack(pathname: string): boolean {
  return (
    pathname !== "/assignments" &&
    pathname !== "/home" &&
    pathname !== "/"
  );
}
