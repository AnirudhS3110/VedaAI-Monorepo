import { format, parseISO } from "date-fns";

export function formatDisplayDate(iso: string): string {
  try {
    return format(parseISO(iso), "dd-MM-yyyy");
  } catch {
    return iso;
  }
}

export function formatAssignedDate(iso: string): string {
  try {
    return format(parseISO(iso), "dd-MM-yyyy");
  } catch {
    return iso;
  }
}
