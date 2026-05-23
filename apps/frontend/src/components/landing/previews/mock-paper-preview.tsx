import { MockUiChrome } from "./mock-ui-chrome";

export function MockPaperPreview() {
  return (
    <MockUiChrome title="Generated paper" compact>
      <div className="rounded-lg border border-border/60 bg-white p-2 font-[family-name:var(--font-document)] text-[8px] leading-relaxed text-foreground">
        <p className="text-center text-[9px] font-bold">BIOLOGY — MIDTERM</p>
        <p className="mt-2 font-semibold">Section A — MCQ</p>
        <p className="mt-1 text-muted-foreground">
          1. Which organelle is responsible for photosynthesis?
        </p>
        <p className="mt-0.5 pl-2 text-muted-foreground">a) Mitochondria</p>
        <p className="mt-2 font-semibold">Section B — Short</p>
        <p className="text-muted-foreground">2. Explain the process of…</p>
      </div>
    </MockUiChrome>
  );
}
