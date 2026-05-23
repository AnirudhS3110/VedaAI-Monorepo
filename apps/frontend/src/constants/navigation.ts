import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Clock,
  FileText,
  LayoutGrid,
  Settings,
  Library,
  Sparkles,
  Users,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Optional custom nav icon from /public */
  iconSrc?: string;
  badge?: number;
  disabled?: boolean;
}

export const mainNavItems: NavItem[] = [
  { label: "Home", href: "/home", icon: LayoutGrid },
  {
    label: "My Groups",
    href: "/groups",
    icon: Users,
    iconSrc: "/mygroups-logo.svg",
    disabled: true,
  },
  { label: "Assignments", href: "/assignments", icon: FileText, badge: 0 },
  {
    label: "AI Teacher's Toolkit",
    href: "/toolkit",
    icon: BookOpen,
    disabled: true,
  },
  { label: "My Library", href: "/library", icon: Clock, disabled: true },
];

export const bottomNavItems: NavItem[] = [
  { label: "Settings", href: "/settings", icon: Settings, disabled: true },
];

/** Mobile bottom bar — matches Figma (Phase 2) */
export const mobileBottomNavItems: NavItem[] = [
  { label: "Home", href: "/home", icon: LayoutGrid },
  { label: "Assignments", href: "/assignments", icon: FileText },
  { label: "Library", href: "/library", icon: Library, disabled: true },
  { label: "AI Toolkit", href: "/toolkit", icon: Sparkles, disabled: true },
];

/** Default placeholders for exam paper metadata fields */
export const organization = {
  defaultSchoolName: "Delhi Public School",
  defaultClassName: "5th",
};
