"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useFieldArray, useForm } from "react-hook-form";
import { ContentArea } from "@/components/layout/content-area";
import { PageHeader } from "@/components/layout/page-header";
import { PageTransition } from "@/components/shared/page-transition";
import {
  aggregateFormValues,
  createAssignmentFormSchema,
  type CreateAssignmentFormValues,
} from "@/lib/validations/create-assignment";
import { assignmentsApi } from "@/lib/api/assignments";
import { connectSocket } from "@/lib/socket/client";
import { subscribeToAssignment } from "@/lib/socket/events";
import { useGenerationStore } from "@/stores/generation-store";
import { getErrorMessage } from "@/lib/api/errors";
import { formatAssignedDate } from "@/lib/format-date";
import { initialUploadState } from "@/lib/upload/types";
import type { UploadExtractionState } from "@/lib/upload/types";
import { cn } from "@/lib/utils";
import { useAssignmentsStore } from "@/stores/assignments-store";
import type { CreateAssignmentPayload } from "@/types/assignment";
import { DueDateField } from "./due-date-field";
import { FileUploadZone } from "./file-upload-zone";
import { FormProgress } from "./form-progress";
import { FormStepFooter } from "./form-step-footer";
import { QuestionTypesSection } from "./question-types-section";
import { VoiceInputButton } from "./voice-input-button";
import { organization } from "@/constants/navigation";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { getTemplateById } from "@/lib/home-templates";

const defaultValues: CreateAssignmentFormValues = {
  title: "",
  schoolName: organization.defaultSchoolName,
  className: organization.defaultClassName,
  subject: "",
  dueDate: "",
  questionRows: [
    { type: "mcq", numQuestions: 10, marks: 1 },
    { type: "short", numQuestions: 5, marks: 4 },
  ],
  instructions: "",
};

const fieldClassName = cn(
  "h-11 w-full min-w-0 rounded-xl border border-border bg-background px-4 text-base shadow-sm outline-none sm:text-sm",
  "focus-visible:ring-2 focus-visible:ring-ring/30",
);

export function CreateAssignmentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateAppliedRef = useRef(false);
  const addItem = useAssignmentsStore((s) => s.addItem);
  const [uploadState, setUploadState] =
    useState<UploadExtractionState>(initialUploadState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    setValue,
    getValues,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAssignmentFormValues>({
    resolver: zodResolver(createAssignmentFormSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const fieldArray = useFieldArray({ control, name: "questionRows" });

  useEffect(() => {
    if (templateAppliedRef.current) return;
    const templateId = searchParams.get("template");
    if (!templateId) return;
    const template = getTemplateById(templateId);
    if (!template) return;
    templateAppliedRef.current = true;
    reset({
      ...defaultValues,
      title: template.suggestedTitle,
      instructions: template.instructions,
      questionRows: template.questionRows,
    });
  }, [reset, searchParams]);

  const appendSpeech = useCallback(
    (spoken: string) => {
      const current = getValues("instructions")?.trim() ?? "";
      const next = current ? `${current} ${spoken}` : spoken;
      setValue("instructions", next, { shouldDirty: true });
    },
    [getValues, setValue],
  );

  const speech = useSpeechToText(appendSpeech);

  const onSubmit = handleSubmit(async (values) => {
    if (uploadState.status === "extracting") {
      setSubmitError("Please wait for file processing to finish.");
      return;
    }
    if (uploadState.status === "error" && uploadState.file) {
      setSubmitError(uploadState.error ?? "Fix upload errors before continuing.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const aggregated = aggregateFormValues(values);

      const payload: CreateAssignmentPayload = {
        ...aggregated,
        uploadedContent: uploadState.extractedContent,
      };

      const { assignmentId } = await assignmentsApi.create(payload);

      try {
        await connectSocket();
        subscribeToAssignment(assignmentId, (ack) => {
          useGenerationStore.getState().updateFromEvent(ack);
        });
      } catch {
        // Generating page will reconnect; non-blocking
      }

      const now = new Date().toISOString();
      addItem({
        id: assignmentId,
        title: payload.title,
        subject: payload.subject,
        assignedOn: formatAssignedDate(now),
        dueDate: values.dueDate,
        status: "pending",
        createdAt: now,
        updatedAt: now,
        hasStudyMaterial: Boolean(payload.uploadedContent?.trim()),
      });

      router.push(`/assignments/${assignmentId}/generating`);
      router.refresh();
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <PageTransition className="min-w-0">
      <ContentArea className="max-w-5xl pb-6 pt-3 sm:pt-4 lg:pb-8 lg:pt-8 max-lg:pb-32">
        <PageHeader
          title="Create Assignment"
          description="Set up a new assignment for your students"
          className="hidden lg:flex"
        />

        <FormProgress step={1} totalSteps={2} />

        {submitError && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            {submitError}
          </motion.p>
        )}

        <motion.form
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          onSubmit={onSubmit}
          className="mt-4 space-y-5 sm:mt-6 sm:space-y-6"
        >
          <div className="rounded-2xl border border-border/80 bg-white/50 p-4 shadow-sm sm:p-6 lg:p-8">
            <div className="mb-5 sm:mb-6">
              <h2 className="text-base font-semibold text-foreground sm:text-lg">
                Assignment Details
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Basic information about your assignment
              </p>
            </div>

            <div className="space-y-5 sm:space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <label htmlFor="schoolName" className="text-sm font-medium">
                    School Name
                  </label>
                  <input
                    id="schoolName"
                    placeholder="Delhi Public School"
                    {...register("schoolName")}
                    className={cn(
                      fieldClassName,
                      errors.schoolName && "border-destructive",
                    )}
                  />
                  {errors.schoolName && (
                    <p className="text-xs text-destructive">
                      {errors.schoolName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="className" className="text-sm font-medium">
                    Class
                  </label>
                  <input
                    id="className"
                    placeholder="5th"
                    {...register("className")}
                    className={cn(
                      fieldClassName,
                      errors.className && "border-destructive",
                    )}
                  />
                  {errors.className && (
                    <p className="text-xs text-destructive">
                      {errors.className.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Title
                  </label>
                  <input
                    id="title"
                    placeholder="Quiz on Electricity"
                    {...register("title")}
                    className={cn(
                      fieldClassName,
                      errors.title && "border-destructive",
                    )}
                  />
                  {errors.title && (
                    <p className="text-xs text-destructive">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <input
                    id="subject"
                    placeholder="Science"
                    {...register("subject")}
                    className={cn(
                      fieldClassName,
                      errors.subject && "border-destructive",
                    )}
                  />
                  {errors.subject && (
                    <p className="text-xs text-destructive">
                      {errors.subject.message}
                    </p>
                  )}
                </div>
              </div>

              <FileUploadZone
                state={uploadState}
                onStateChange={setUploadState}
              />

              <DueDateField control={control} error={errors.dueDate} />

              <div className="border-t border-border/50 pt-5 sm:pt-6">
                <h3 className="mb-4 text-sm font-semibold text-foreground">
                  Question types
                </h3>
                <QuestionTypesSection
                  control={control}
                  fieldArray={fieldArray}
                  errors={errors}
                />
              </div>

              <div className="space-y-2 border-t border-border/50 pt-5 sm:pt-6">
                <label
                  htmlFor="instructions"
                  className="text-sm font-medium text-foreground"
                >
                  Additional Information{" "}
                  <span className="font-normal text-muted-foreground">
                    (For better output)
                  </span>
                </label>
                <div className="relative min-w-0">
                  <textarea
                    id="instructions"
                    rows={5}
                    placeholder="e.g. Generate a question paper for 3 hour exam duration..."
                    {...register("instructions")}
                    className={cn(
                      "w-full min-w-0 resize-none rounded-2xl border-2 border-dashed border-border bg-muted/20 px-4 py-3 pr-14 text-base outline-none sm:text-sm",
                      "placeholder:text-muted-foreground focus-visible:border-border focus-visible:ring-2 focus-visible:ring-ring/20",
                      errors.instructions && "border-destructive",
                    )}
                  />
                  <VoiceInputButton
                    isListening={speech.isListening}
                    isSupported={speech.isSupported}
                    unsupportedHint={speech.unsupportedHint}
                    onToggle={speech.toggle}
                  />
                </div>
                {!speech.isSupported && speech.unsupportedHint && (
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {speech.unsupportedHint}
                  </p>
                )}
                {speech.isSupported && speech.isBrave && speech.unsupportedHint && (
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {speech.unsupportedHint}
                  </p>
                )}
                {speech.errorMessage && (
                  <p className="text-xs text-destructive">{speech.errorMessage}</p>
                )}
                {speech.isListening && (
                  <p className="text-xs text-red-600/90">
                    Listening… speak clearly, then tap the mic to stop.
                  </p>
                )}
                {errors.instructions && (
                  <p className="text-xs text-destructive">
                    {errors.instructions.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <FormStepFooter
            onNext={() => void onSubmit()}
            isSubmitting={isSubmitting}
          />
        </motion.form>
      </ContentArea>
    </PageTransition>
  );
}
