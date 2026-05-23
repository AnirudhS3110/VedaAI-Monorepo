import { MockUiChrome } from "./mock-ui-chrome";

export function MockCreatePreview() {
  return (
    <MockUiChrome title="Create assignment" compact>
      <div className="space-y-2.5">
        <div className="h-7 rounded-lg border border-border/60 bg-card px-2 text-[9px] leading-7 text-muted-foreground">
          Biology Midterm — Class 10
        </div>
        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-2 text-center text-[9px] text-muted-foreground">
          Upload PDF / TXT
        </div>
        <div className="rounded-lg border border-border/60 bg-card p-2">
          <p className="text-[9px] font-medium">MCQ · 10 × 1 mark</p>
          <p className="mt-1 text-[8px] text-muted-foreground">Short · 5 × 4 marks</p>
        </div>
        <div className="rounded-xl bg-[#1a1a1a] py-2 text-center text-[9px] font-medium text-white">
          Generate
        </div>
      </div>
    </MockUiChrome>
  );
}
