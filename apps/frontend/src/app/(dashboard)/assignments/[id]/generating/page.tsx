import { GeneratingView } from "@/components/assignments/generating-view";

interface GeneratingPageProps {
  params: Promise<{ id: string }>;
}

export default async function GeneratingPage({ params }: GeneratingPageProps) {
  const { id } = await params;
  return <GeneratingView assignmentId={id} />;
}
