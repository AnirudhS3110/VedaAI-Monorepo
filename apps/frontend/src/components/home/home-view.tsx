"use client";

import { useMemo } from "react";
import { ContentArea } from "@/components/layout/content-area";
import { PageTransition } from "@/components/shared/page-transition";
import { useAssignmentsList } from "@/hooks/use-assignments-list";
import { useRecentExportedPdfs } from "@/hooks/use-recent-exported-pdfs";
import {
  getContinueWorkingItems,
  getStudyMaterialItems,
} from "@/lib/home-workspace";
import { HomeContinueWorking } from "./home-continue-working";
import { HomeExportedPdfs } from "./home-exported-pdfs";
import { HomeGreeting } from "./home-greeting";
import { HomeQuickGenerate } from "./home-quick-generate";
import { HomeStudyMaterials } from "./home-study-materials";
import { HomeTemplates } from "./home-templates";

export function HomeView() {
  const { items, isLoading, error } = useAssignmentsList();

  const continueItems = useMemo(
    () => getContinueWorkingItems(items, 6),
    [items],
  );
  const studyItems = useMemo(() => getStudyMaterialItems(items, 5), [items]);
  const { exported, isChecking } = useRecentExportedPdfs(items);

  return (
    <PageTransition>
      <ContentArea className="min-w-0 pb-6 pt-3 max-lg:pt-2 sm:pt-4 lg:pb-10 lg:pt-6">
        <div className="space-y-8 max-lg:space-y-6 lg:space-y-10">
          <HomeGreeting />
          <HomeQuickGenerate />

          {error && (
            <p className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          )}

          <HomeContinueWorking items={continueItems} isLoading={isLoading} />
          <HomeTemplates />
          {/* <HomeStudyMaterials items={studyItems} isLoading={isLoading} /> */}
          <HomeExportedPdfs exported={exported} isChecking={isChecking} />
        </div>
      </ContentArea>
    </PageTransition>
  );
}
