/** Shared route-active check for sidebar, bottom nav, and drawer */
export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/assignments") {
    return (
      pathname === "/assignments" || pathname.startsWith("/assignments/")
    );
  }
  if (href === "/home") {
    return pathname === "/home" || pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
