/** Browser capability helpers (Chrome, Brave, Safari, etc.) */

export function isBraveBrowserSync(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & {
    brave?: { isBrave?: () => Promise<boolean> };
  };
  return Boolean(nav.brave?.isBrave);
}

export async function detectBraveBrowser(): Promise<boolean> {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & {
    brave?: { isBrave?: () => Promise<boolean> };
  };
  try {
    if (nav.brave?.isBrave) {
      return await nav.brave.isBrave();
    }
  } catch {
    /* ignore */
  }
  return false;
}

/** Prefer polling first in Brave — Shields often disrupt WebSocket-first connects */
export function getSocketTransports(): ("websocket" | "polling")[] {
  if (isBraveBrowserSync()) {
    return ["polling", "websocket"];
  }
  return ["websocket", "polling"];
}

export type SpeechSupportLevel = "full" | "unsupported" | "blocked";

export function getSpeechSupportLevel(): SpeechSupportLevel {
  if (typeof window === "undefined") return "unsupported";

  const w = window as Window & {
    SpeechRecognition?: unknown;
    webkitSpeechRecognition?: unknown;
  };

  if (!w.SpeechRecognition && !w.webkitSpeechRecognition) {
    return "unsupported";
  }

  if (!window.isSecureContext) {
    return "blocked";
  }

  return "full";
}

export function getSpeechUnsupportedMessage(
  level: SpeechSupportLevel,
  brave: boolean,
): string {
  if (level === "blocked") {
    return "Voice input requires a secure connection (HTTPS).";
  }
  if (level === "unsupported") {
    if (brave) {
      return "Voice transcription is not available in this browser. Try Chrome, or reduce Brave Shields for this site.";
    }
    return "Voice transcription is not supported in this browser. Try Google Chrome.";
  }
  if (brave) {
    return "Voice transcription may require microphone permissions or reduced Brave Shields for this site.";
  }
  return "Allow microphone access when prompted to use voice input.";
}
