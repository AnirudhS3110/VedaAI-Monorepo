import {
  IMAGE_PLACEHOLDER_NOTE,
  MAX_EXTRACTED_CHARS,
  MAX_UPLOAD_FILE_MB,
} from "./constants";
import type { UploadFileKind } from "./types";

function cleanExtractedText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

export function prepareUploadedContent(raw: string): {
  content: string;
  truncated: boolean;
} {
  const cleaned = cleanExtractedText(raw);
  if (!cleaned) {
    return { content: "", truncated: false };
  }
  if (cleaned.length <= MAX_EXTRACTED_CHARS) {
    return { content: cleaned, truncated: false };
  }
  return {
    content:
      cleaned.slice(0, MAX_EXTRACTED_CHARS) +
      "\n\n[Note: Document was large. Only the first portion was included for AI context.]",
    truncated: true,
  };
}

export function detectUploadKind(file: File): UploadFileKind {
  const name = file.name.toLowerCase();
  if (file.type === "application/pdf" || name.endsWith(".pdf")) return "pdf";
  if (file.type === "text/plain" || name.endsWith(".txt")) return "txt";
  if (file.type === "image/jpeg" || file.type === "image/png") return "image";
  return null;
}

export function validateUploadFile(file: File): string | null {
  const kind = detectUploadKind(file);
  if (!kind) {
    return "Supported files: PDF, TXT, JPEG, or PNG";
  }
  if (file.size > MAX_UPLOAD_FILE_MB * 1024 * 1024) {
    return `File must be under ${MAX_UPLOAD_FILE_MB}MB`;
  }
  return null;
}

async function extractPdfText(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");

  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data }).promise;

  const parts: string[] = [];
  for (let page = 1; page <= pdf.numPages; page++) {
    const pageContent = await pdf.getPage(page);
    const textContent = await pageContent.getTextContent();
    const pageText = textContent.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    if (pageText.trim()) {
      parts.push(pageText);
    }
  }

  return cleanExtractedText(parts.join("\n\n"));
}

async function extractTxtText(file: File): Promise<string> {
  const raw = await file.text();
  return cleanExtractedText(raw);
}

export interface ExtractionResult {
  content: string;
  truncated: boolean;
  message: string | null;
  previewUrl: string | null;
}

export async function extractContentFromFile(
  file: File,
  kind: UploadFileKind,
): Promise<ExtractionResult> {
  if (!kind) {
    throw new Error("Unsupported file type");
  }

  if (kind === "image") {
    const previewUrl = URL.createObjectURL(file);
    return {
      content: IMAGE_PLACEHOLDER_NOTE,
      truncated: false,
      message:
        "Image attached as reference. Add details in Additional Information for best results.",
      previewUrl,
    };
  }

  if (kind === "txt") {
    const raw = await extractTxtText(file);
    if (!raw) {
      throw new Error("Text file appears to be empty");
    }
    const { content, truncated } = prepareUploadedContent(raw);
    return {
      content,
      truncated,
      message: truncated
        ? "Large document detected. Using partial content for question generation."
        : `Extracted ${content.length.toLocaleString()} characters from text file.`,
      previewUrl: null,
    };
  }

  const raw = await extractPdfText(file);
  if (!raw || raw.length < 20) {
    throw new Error(
      "Could not extract readable text from this PDF. Try a text-based PDF or paste content in Additional Information.",
    );
  }

  const { content, truncated } = prepareUploadedContent(raw);
  return {
    content,
    truncated,
    message: truncated
      ? "Large document detected. Using partial content for question generation."
      : `Extracted text from ${file.name} (${content.length.toLocaleString()} characters).`,
    previewUrl: null,
  };
}
