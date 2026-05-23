import { AssignmentOutputView } from "@/components/assignment-output/assignment-output-view";

interface AssignmentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AssignmentDetailPage({
  params,
}: AssignmentDetailPageProps) {
  const { id } = await params;
  return <AssignmentOutputView assignmentId={id} />;
}
