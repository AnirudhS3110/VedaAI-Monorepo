import { Sparkles } from "lucide-react";
import { MockUiChrome } from "./mock-ui-chrome";

export function MockGenerationPreview() {
  return (
    <MockUiChrome title="Generating…" compact>
      <div className="rounded-xl bg-[#1a1a1a] p-3 text-white">
        <div className="flex items-center gap-2">
          <Sparkles className="size-3.5" />
          <p className="text-[9px] font-medium">Crafting assessment</p>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/20">
          <div className="h-full w-[72%] rounded-full bg-orange-500" />
        </div>
        <p className="mt-2 text-[8px] text-white/60">Validating section 2…</p>
      </div>
      <ul className="mt-2 space-y-1 text-[8px] text-muted-foreground">
        <li className="text-emerald-600">✓ Parsing syllabus</li>
        <li className="text-emerald-600">✓ Building sections</li>
        <li>○ Final validation</li>
      </ul>
    </MockUiChrome>
  );
}
