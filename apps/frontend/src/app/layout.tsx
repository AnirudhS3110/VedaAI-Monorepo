import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AppSessionProvider } from "@/components/providers/session-provider";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-sans",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-document",
});

export const metadata: Metadata = {
  title: "VedaAI — AI-powered assessment generation",
  description:
    "Generate structured question papers with real-time AI workflows, semantic validation, and PDF export.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        bricolage.variable,
        inter.variable,
        "font-sans",
      )}
    >
      <body className="flex min-h-full flex-col">
        <AppSessionProvider>{children}</AppSessionProvider>
      </body>
    </html>
  );
}
