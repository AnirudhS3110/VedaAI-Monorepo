export type UploadFileKind = "pdf" | "txt" | "image" | null;

export type UploadExtractionStatus =
  | "idle"
  | "extracting"
  | "ready"
  | "error";

export interface UploadExtractionState {
  file: File | null;
  kind: UploadFileKind;
  status: UploadExtractionStatus;
  extractedContent: string;
  previewUrl: string | null;
  truncated: boolean;
  message: string | null;
  error: string | null;
}

export const initialUploadState = (): UploadExtractionState => ({
  file: null,
  kind: null,
  status: "idle",
  extractedContent: "",
  previewUrl: null,
  truncated: false,
  message: null,
  error: null,
});
