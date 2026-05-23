import { ContentArea } from "@/components/layout/content-area";
import { PageHeader } from "@/components/layout/page-header";
import { PageTransition } from "@/components/shared/page-transition";

export default function HomePage() {
  return (
    <PageTransition>
      <ContentArea>
        <PageHeader
          title="Home"
          description="Welcome to VedaAI — your AI teaching workspace."
        />
        <div className="mt-12 flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center text-muted-foreground">
          <p className="text-sm">Dashboard home — coming soon</p>
        </div>
      </ContentArea>
    </PageTransition>
  );
}
