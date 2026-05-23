"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AssignmentsEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col items-center justify-center px-4 py-16 text-center"
    >
      <div className="relative mb-8 flex h-52 w-full max-w-[280px] items-center justify-center">
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-b from-muted/40 to-transparent"
          aria-hidden
        />
        <Image
          src="/NotFoundIllustration.svg"
          alt="No assignments yet"
          width={240}
          height={240}
          priority
          className="relative z-10 h-auto w-full max-w-[220px] object-contain"
        />
      </div>

      <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        No assignments yet
      </h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
        Create your first assignment to start collecting and grading student
        submissions. You can set up rubrics, define marking criteria, and let AI
        assist with grading.
      </p>

      <Button
        asChild
        size="lg"
        className="mt-8 hidden h-12 w-full max-w-sm cursor-pointer rounded-2xl bg-[#1a1a1a] px-6 text-base font-medium text-white hover:bg-[#2a2a2a] sm:w-auto lg:inline-flex"
      >
        <Link href="/assignments/create">
          <Plus className="size-5" />
          Create Your First Assignment
        </Link>
      </Button>

      <p className="mt-6 text-xs text-muted-foreground lg:hidden">
        Or tap the <span className="font-medium text-orange-500">+</span> button
        below to create an assignment.
      </p>
    </motion.div>
  );
}
