import { assignmentsApi } from "./assignments";
import { getApiUserId } from "./auth-headers";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function pdfFetchInit(): RequestInit {
  const userId = getApiUserId();
  if (!userId) throw new Error("Not authenticated. Please sign in to download PDFs.");
  return { headers: { "X-User-Id": userId } };
}

export async function pdfExists(assignmentId: string): Promise<boolean> {
  const url = assignmentsApi.pdfDownloadUrl(assignmentId);
  const init = pdfFetchInit();
  try {
    const res = await fetch(url, { method: "HEAD", ...init });
    if (res.ok) return true;
    if (res.status === 404) return false;
    const getRes = await fetch(url, { method: "GET", ...init });
    return getRes.ok;
  } catch {
    return false;
  }
}

export async function ensurePdfReady(
  assignmentId: string,
  options?: { maxAttempts?: number; intervalMs?: number },
): Promise<void> {
  const maxAttempts = options?.maxAttempts ?? 24;
  const intervalMs = options?.intervalMs ?? 2000;

  if (await pdfExists(assignmentId)) {
    return;
  }

  await assignmentsApi.requestPdf(assignmentId);

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await sleep(intervalMs);
    if (await pdfExists(assignmentId)) {
      return;
    }
  }

  throw new Error(
    "PDF is still generating. Please try again in a few seconds.",
  );
}

export async function downloadAssignmentPdfFile(
  assignmentId: string,
): Promise<void> {
  const url = assignmentsApi.pdfDownloadUrl(assignmentId);
  const res = await fetch(url, pdfFetchInit());

  if (!res.ok) {
    throw new Error(
      res.status === 404
        ? "PDF not found. Generate it first."
        : "Failed to download PDF.",
    );
  }

  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = `assignment-${assignmentId}.pdf`;
  anchor.click();
  URL.revokeObjectURL(objectUrl);
}
