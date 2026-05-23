import { ApiRequestError } from "@/types/api";

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    const detail = error.details
      ? Object.values(error.details).flat().filter(Boolean)[0]
      : undefined;
    return detail ?? error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong. Please try again.";
}
