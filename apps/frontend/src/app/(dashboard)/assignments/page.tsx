import { AssignmentsView } from "@/components/assignments/assignments-view";

interface AssignmentsPageProps {
  searchParams: Promise<{ empty?: string }>;
}

export default async function AssignmentsPage({
  searchParams,
}: AssignmentsPageProps) {
  const { empty } = await searchParams;
  const showEmpty = empty === "1" || empty === "true";

  return <AssignmentsView showEmpty={showEmpty} />;
}
