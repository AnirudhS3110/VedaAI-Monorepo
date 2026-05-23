/** Max characters sent to backend as uploadedContent (matches backend limit). */
export const MAX_EXTRACTED_CHARS = 15_000;

export const MAX_UPLOAD_FILE_MB = 10;

export const ACCEPTED_UPLOAD_MIME = [
  "application/pdf",
  "text/plain",
  ".txt", // handled via extension fallback
] as const;

export const ACCEPTED_IMAGE_MIME = ["image/jpeg", "image/png"] as const;

export const IMAGE_PLACEHOLDER_NOTE =
  "[Image uploaded for reference only. No text was extracted. Please rely on assignment title, subject, and teacher instructions below.]";
