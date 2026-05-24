"use client";

import { motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceInputButtonProps {
  isListening: boolean;
  isSupported: boolean;
  unsupportedHint?: string | null;
  onToggle: () => void;
}

export function VoiceInputButton({
  isListening,
  isSupported,
  unsupportedHint,
  onToggle,
}: VoiceInputButtonProps) {
  const title =
    unsupportedHint ??
    (isListening ? "Stop listening" : "Speak to add instructions");

  if (!isSupported) {
    return (
      <button
        type="button"
        disabled
        className="absolute bottom-3 right-3 flex size-10 cursor-not-allowed items-center justify-center rounded-xl text-muted-foreground/50"
        title={title}
        aria-label={title}
      >
        <MicOff className="size-5" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "touch-manipulation tap-highlight-none absolute bottom-3 right-3 flex size-10 cursor-pointer items-center justify-center rounded-xl transition-colors active:scale-95",
        isListening
          ? "bg-red-500/15 text-red-600"
          : "text-muted-foreground active:bg-muted lg:hover:bg-muted lg:hover:text-foreground",
      )}
      aria-label={isListening ? "Stop voice input" : "Start voice input"}
      title={title}
    >
      {isListening && (
        <motion.span
          className="absolute inset-0 rounded-lg border-2 border-red-400/60"
          animate={{ scale: [1, 1.15, 1], opacity: [0.7, 0.2, 0.7] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <Mic
        className={cn("relative z-10 size-5", isListening && "animate-pulse")}
      />
    </button>
  );
}
