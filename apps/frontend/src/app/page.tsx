import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LandingPage } from "@/components/landing/landing-page";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    redirect("/home");
  }

  return <LandingPage />;
}
