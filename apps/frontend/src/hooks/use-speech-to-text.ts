"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  detectBraveBrowser,
  getSpeechSupportLevel,
  getSpeechUnsupportedMessage,
  type SpeechSupportLevel,
} from "@/lib/browser-compat";

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: { transcript: string };
}

interface SpeechRecognitionEventLike {
  results: Iterable<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionErrorEventLike {
  error?: string;
  message?: string;
}

interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function getSpeechRecognitionCtor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function mapSpeechError(
  code: string | undefined,
  isBrave: boolean,
): string {
  switch (code) {
    case "not-allowed":
    case "service-not-allowed":
      return getSpeechUnsupportedMessage("full", isBrave);
    case "audio-capture":
      return "Microphone not found or blocked. Check system permissions.";
    case "network":
      return "Speech service unreachable. Check your connection or try Chrome.";
    case "no-speech":
      return "No speech detected. Try speaking again.";
    case "aborted":
      return "";
    default:
      return code
        ? `Voice input error (${code}). Try Chrome or adjust Brave Shields.`
        : "Voice input failed. Try Chrome or allow microphone access.";
  }
}

export function useSpeechToText(onTranscript: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [supportLevel, setSupportLevel] = useState<SpeechSupportLevel>("unsupported");
  const [isBrave, setIsBrave] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const isSupported = supportLevel === "full";

  useEffect(() => {
    setSupportLevel(getSpeechSupportLevel());
    void detectBraveBrowser().then(setIsBrave);
  }, []);

  const unsupportedHint =
    supportLevel !== "full"
      ? getSpeechUnsupportedMessage(supportLevel, isBrave)
      : isBrave
        ? getSpeechUnsupportedMessage("full", true)
        : null;

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
  }, []);

  const start = useCallback(async () => {
    const SpeechRecognitionCtor = getSpeechRecognitionCtor();
    if (!SpeechRecognitionCtor || supportLevel !== "full") {
      setErrorMessage(
        getSpeechUnsupportedMessage(supportLevel, isBrave),
      );
      return;
    }

    setErrorMessage(null);
    stop();

    if (navigator.permissions?.query) {
      try {
        const mic = await navigator.permissions.query({
          name: "microphone" as PermissionName,
        });
        if (mic.state === "denied") {
          setErrorMessage(getSpeechUnsupportedMessage("full", isBrave));
          return;
        }
      } catch {
        /* Permissions API optional */
      }
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang =
      typeof navigator !== "undefined" && navigator.language
        ? navigator.language
        : "en-IN";

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      let finalText = "";
      for (const result of event.results) {
        if (result.isFinal) {
          finalText += result[0].transcript;
        }
      }
      const trimmed = finalText.trim();
      if (trimmed) {
        onTranscript(trimmed);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
      const msg = mapSpeechError(event.error, isBrave);
      if (msg) setErrorMessage(msg);
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    try {
      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    } catch {
      setErrorMessage(
        getSpeechUnsupportedMessage("full", isBrave),
      );
      recognitionRef.current = null;
      setIsListening(false);
    }
  }, [isBrave, onTranscript, stop, supportLevel]);

  const toggle = useCallback(() => {
    if (isListening) {
      stop();
    } else {
      void start();
    }
  }, [isListening, start, stop]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  return {
    isListening,
    isSupported,
    supportLevel,
    isBrave,
    errorMessage,
    unsupportedHint,
    toggle,
    stop,
  };
}
