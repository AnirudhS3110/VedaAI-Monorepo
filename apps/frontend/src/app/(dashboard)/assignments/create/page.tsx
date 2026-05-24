import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { CreateAssignmentForm } from "@/components/create-assignment/create-assignment-form";

function CreateAssignmentFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
      <Loader2 className="size-8 animate-spin" />
    </div>
  );
}

export default function CreateAssignmentPage() {
  return (
    <Suspense fallback={<CreateAssignmentFallback />}>
      <CreateAssignmentForm />
    </Suspense>
  );
}
