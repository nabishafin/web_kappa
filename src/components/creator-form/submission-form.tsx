"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ChangeEvent, type ComponentProps, type FormEvent, type ReactNode } from "react";
import { useForm, useWatch, type FieldPath } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { cn, sleep } from "@/lib/utils";
import { CheckboxGroup } from "./checkbox-group";
import { CheckboxBox } from "./choice";
import { Dropzone } from "./dropzone";
import { describedBy, Field, FieldError, labelClass, RequiredMark } from "./field";
import { RadioGroup } from "./radio-group";
import {
  applicationSchema,
  audiences,
  contentTypes,
  contentWarnings,
  DRAFT_KEY,
  emptyApplication,
  exclusivityOptions,
  genres,
  OTHER,
  ratings,
  readDraft,
  subtitleOptions,
  yesNo,
  type ApplicationValues,
} from "./schema";
import { SectionTitle } from "./section-title";
import { Select } from "./select";
import { TextArea } from "./text-area";
import { TextInput } from "./text-input";

/** vertical rhythm measured on the 1440 artboard (mobile uses a tighter, uniform scale) */
const gap = {
  first: "mt-3.5",
  field: "mt-6 md:mt-[33px]",
  afterSelect: "mt-6 md:mt-[30px]",
  afterGroup: "mt-8 md:mt-[41px]",
  afterArea: "mt-6 md:mt-[24.5px]",
  afterDrop: "mt-5 md:mt-[22px]",
} as const;

const twoCol = "grid gap-6 md:grid-cols-2 md:gap-x-5";
const SAVE_DELAY = 600;

export function SubmissionForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const submittedRef = useRef(false);
  const [contentFiles, setContentFiles] = useState<File[]>([]);
  const [promoFiles, setPromoFiles] = useState<File[]>([]);
  const [draftRestored, setDraftRestored] = useState(false);

  const {
    register,
    handleSubmit,
    subscribe,
    control,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitting, isSubmitted, isSubmitSuccessful, submitCount },
  } = useForm<ApplicationValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: emptyApplication,
    mode: "onTouched",
    reValidateMode: "onChange",
    shouldFocusError: false, // we scroll + focus the first invalid control in DOM order ourselves
  });

  /* ---------------------------------------------------------- draft persistence */
  useEffect(() => {
    let draft: ApplicationValues | null = null;
    try {
      draft = readDraft(window.localStorage.getItem(DRAFT_KEY));
    } catch {
      /* storage unavailable (private mode) — start empty */
    }
    if (!draft) return;
    // restore after the first paint so the SSR markup hydrates untouched
    const frame = requestAnimationFrame(() => {
      reset(draft, { keepDefaultValues: true });
      setDraftRestored(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [reset]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const unsubscribe = subscribe({
      formState: { values: true },
      callback: ({ values }) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (submittedRef.current) return;
        try {
          window.localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
        } catch {
          /* quota / private mode — drafts are best-effort */
        }
      }, SAVE_DELAY);
      },
    });
    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [subscribe]);

  function discardDraft() {
    try {
      window.localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
    reset(emptyApplication);
    setDraftRestored(false);
  }

  /* ------------------------------------------------- focus first invalid field */
  // runs once RHF has published the errors of a failed submit (errors + submitCount land together)
  useEffect(() => {
    if (!submitCount || isSubmitSuccessful) return;
    const el = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"], [data-invalid]');
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    el.focus({ preventScroll: true });
  }, [submitCount, isSubmitSuccessful]);

  /* ------------------------------------------------------------------- submit */
  async function onValid(values: ApplicationValues) {
    // No backend yet: build the multipart payload the API will receive, then simulate latency.
    const body = new FormData();
    body.append("application", JSON.stringify(values));
    contentFiles.forEach((f) => body.append("contentFiles", f));
    promoFiles.forEach((f) => body.append("promoFiles", f));
    await sleep(900);

    submittedRef.current = true;
    try {
      window.localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
    router.push("/creators/apply/submitted");
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => handleSubmit(onValid)(e);

  /** when the user types into an “Other” box, tick its checkbox for them */
  function autoCheckOther(group: "genres" | "warnings") {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const list = getValues(group);
      if (e.target.value.trim() && !list.includes(OTHER)) setValue(group, [...list, OTHER], { shouldValidate: isSubmitted });
    };
  }

  const err = (name: FieldPath<ApplicationValues>) => errors[name as keyof ApplicationValues]?.message;

  /** props shared by every simple text control */
  const text = (name: FieldPath<ApplicationValues>) => ({
    id: name,
    invalid: !!err(name),
    "aria-describedby": describedBy(name, err(name)),
  });

  const available = useWatch({ control, name: "availableElsewhere" });

  return (
    <form ref={formRef} noValidate aria-labelledby="apply-heading" onSubmit={onSubmit}>
      <div className="mt-8 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 md:mt-[31.5px]">
        <p className="relative top-px text-base leading-[18.75px] font-bold text-[#ff4d4d]">* Indicates required question</p>
        <p aria-live="polite" className="text-sm text-[#bebdbf]">
          {draftRestored && (
            <>
              Draft restored.{" "}
              <button type="button" onClick={discardDraft} className="text-[#c77dff] underline-offset-2 hover:underline">
                Start over
              </button>
            </>
          )}
        </p>
      </div>

      {/* ------------------------------------------------ Company Information */}
      <section aria-labelledby="sec-company" className="mt-8">
        <SectionTitle id="sec-company">Company Information</SectionTitle>

        <Field id="companyName" label="Company Name:" required error={err("companyName")} className={gap.first}>
          <TextInput {...text("companyName")} autoComplete="organization" placeholder="your answer" {...register("companyName")} />
        </Field>
        <Field id="companyWebsite" label="Company Website:" required error={err("companyWebsite")} className={gap.field}>
          <TextInput {...text("companyWebsite")} type="url" inputMode="url" autoComplete="url" placeholder="your answer" {...register("companyWebsite")} />
        </Field>
        <Field id="contactPerson" label="Contact Person:" required error={err("contactPerson")} className={gap.field}>
          <TextInput {...text("contactPerson")} autoComplete="name" placeholder="your answer" {...register("contactPerson")} />
        </Field>
        <div className={cn(twoCol, gap.field)}>
          <Field id="contactEmail" label="Contact Email Address:" required error={err("contactEmail")}>
            <TextInput {...text("contactEmail")} type="email" autoComplete="email" placeholder="your answer" {...register("contactEmail")} />
          </Field>
          <Field id="contactPhone" label="Contact Phone Number:" required error={err("contactPhone")}>
            <TextInput {...text("contactPhone")} type="tel" autoComplete="tel" placeholder="your answer" {...register("contactPhone")} />
          </Field>
        </div>
      </section>

      {/* ------------------------------------------------ Content Information */}
      <section aria-labelledby="sec-content" className="mt-12 md:mt-[65px]">
        <SectionTitle id="sec-content">Content Information</SectionTitle>

        <div className={cn(twoCol, gap.first)}>
          <Field id="contentType" label="Content Type:" required error={err("contentType")}>
            <Select {...text("contentType")} className="h-12" placeholder="Select Type" options={contentTypes} {...register("contentType")} />
          </Field>
          <Field id="title" label="Title of Show/Movie:" required error={err("title")}>
            <TextInput {...text("title")} className="h-12" {...register("title")} />
          </Field>
        </div>

        <CheckboxGroup
          id="genres"
          legend="Genre:"
          required
          error={err("genres")}
          options={genres}
          inputProps={register("genres")}
          className={gap.afterSelect}
          other={{
            value: OTHER,
            input: (
              <TextInput
                {...text("genreOther")}
                aria-label="Other genre"
                placeholder="Please specify"
                {...register("genreOther", { onChange: autoCheckOther("genres") })}
              />
            ),
          }}
        />
        <FieldError id="genreOther" message={err("genreOther")} />

        <Field id="description" label="Description:" required error={err("description")} className={gap.afterGroup}>
          <TextArea
            {...text("description")}
            placeholder="Provide a detailed description of your content..."
            className="placeholder:text-[#e6e6e6]"
            {...register("description")}
          />
        </Field>

        <div className={cn(twoCol, gap.afterArea)}>
          <Field id="targetAudience" label="Target Audience:" required error={err("targetAudience")}>
            <Select {...text("targetAudience")} className="h-12" placeholder="Select Audience" options={audiences} {...register("targetAudience")} />
          </Field>
          <Field id="contentRating" label="Content Rating:" required error={err("contentRating")}>
            <Select {...text("contentRating")} className="h-12" placeholder="Select Rating" options={ratings} {...register("contentRating")} />
          </Field>
        </div>

        <CheckboxGroup
          id="warnings"
          legend={
            <span className="block max-w-[740px]">
              If you selected your content as intended for older audiences (PG-13/14 or R/MA), please choose the relevant content warnings
              below:
            </span>
          }
          error={err("warnings")}
          options={contentWarnings}
          inputProps={register("warnings")}
          className={gap.afterSelect}
          other={{
            value: OTHER,
            input: (
              <TextInput
                {...text("warningOther")}
                aria-label="Other content warning"
                placeholder="Please specify"
                {...register("warningOther", { onChange: autoCheckOther("warnings") })}
              />
            ),
          }}
        />
        <FieldError id="warningOther" message={err("warningOther")} />

        <Field id="awards" label="Any Awards or Recognitions:" required error={err("awards")} className={gap.afterGroup}>
          <TextInput {...text("awards")} placeholder="List any awards, film festival selections, or recognitions" {...register("awards")} />
        </Field>
        <Field id="showLink" label="Link to Show/Movie Website or Social Media:" required error={err("showLink")} className={gap.field}>
          <TextInput {...text("showLink")} type="url" inputMode="url" placeholder="https://example.com/movie" {...register("showLink")} />
        </Field>
        <Field id="runtime" label="Episode Count/Movie Length:" required error={err("runtime")} className={gap.field}>
          <TextInput {...text("runtime")} placeholder="e.g., 12 episodes (22 min each) or 90 minutes" {...register("runtime")} />
        </Field>
        <div className={cn(twoCol, gap.field)}>
          <Field id="languages" label="Languages:" required error={err("languages")}>
            <TextInput {...text("languages")} placeholder="e.g., English, Spanish, French" {...register("languages")} />
          </Field>
          <Field id="subtitles" label="Subtitle Availability:" required error={err("subtitles")}>
            <Select {...text("subtitles")} className="h-11" placeholder="Select Option" options={subtitleOptions} {...register("subtitles")} />
          </Field>
        </div>
        <Field id="contentLink" label="Link to Content (if applicable):" error={err("contentLink")} className={gap.field}>
          <TextInput
            {...text("contentLink")}
            type="url"
            inputMode="url"
            placeholder="https://drive.google.com/... or streaming link"
            {...register("contentLink")}
          />
        </Field>

        <RadioGroup
          id="availableElsewhere"
          legend="Is the content currently available on other platforms/streaming services?"
          required
          error={err("availableElsewhere")}
          options={yesNo}
          inputProps={register("availableElsewhere")}
          className="mt-6 md:mt-[34px]"
        >
          {available === "yes" && (
            <Field id="platforms" label="Which platforms or services?" required error={err("platforms")} className="mt-5 animate-fade-in">
              <TextInput {...text("platforms")} placeholder="e.g., YouTube, Vimeo On Demand, Tubi" {...register("platforms")} />
            </Field>
          )}
        </RadioGroup>
      </section>

      {/* ------------------------------------------------------- File Uploads */}
      <section aria-labelledby="sec-files" className="mt-10 md:mt-9">
        <SectionTitle id="sec-files">File Uploads</SectionTitle>

        <div className="mt-3.5">
          <p id="contentFiles-label" className={cn(labelClass, "mb-[10.75px]")}>
            File Upload (if applicable):
          </p>
          <Dropzone id="contentFiles" labelledBy="contentFiles-label" files={contentFiles} onFilesChange={setContentFiles} />
        </div>
        <div className={gap.afterDrop}>
          <p id="promoFiles-label" className={cn(labelClass, "mb-[9.75px]")}>
            Promotional Material (e.g., trailers, posters):
          </p>
          <Dropzone
            id="promoFiles"
            labelledBy="promoFiles-label"
            accept="image/*,video/*,application/pdf"
            files={promoFiles}
            onFilesChange={setPromoFiles}
          />
        </div>
        <Field id="driveLinks" label="If you're not able to upload any files, put the drive links here:" error={err("driveLinks")} className={gap.afterDrop}>
          <TextArea {...text("driveLinks")} placeholder="Paste your Google Drive or other cloud storage links here (one per line)" {...register("driveLinks")} />
        </Field>
      </section>

      {/* -------------------------------------------------- Licensing & Legal */}
      <section aria-labelledby="sec-legal" className="mt-8 md:mt-[27px]">
        <SectionTitle id="sec-legal">Licensing &amp; Legal</SectionTitle>

        <Field id="licensing" label="Licensing Terms and Availability:" error={err("licensing")} className={gap.first}>
          <TextArea
            {...text("licensing")}
            placeholder="Describe your licensing terms, availability periods, or any restrictions..."
            {...register("licensing")}
          />
        </Field>

        <RadioGroup
          id="exclusivity"
          legend="Exclusivity Agreement (if applicable):"
          error={err("exclusivity")}
          options={exclusivityOptions}
          inputProps={register("exclusivity")}
          className={gap.afterArea}
        />

        <Field id="fit" label="Why do you think your content would be a good fit for Channel Infinity?" required error={err("fit")} className="mt-7 md:mt-[34px]">
          <TextArea {...text("fit")} placeholder="Tell us what makes your content unique and suitable for our platform..." {...register("fit")} />
        </Field>
        <Field id="comments" label="Additional Comments or Special Requests:" error={err("comments")} className={gap.afterArea}>
          <TextArea {...text("comments")} placeholder="Any additional information you'd like us to know..." {...register("comments")} />
        </Field>

        <div className="mt-6 space-y-6 md:mt-[24.5px] md:space-y-[26px]">
          <Agreement id="agreeRights" error={err("agreeRights")} {...register("agreeRights")}>
            I confirm that I have the right to submit this content and that it does not infringe on any copyrights. I understand that submission does
            not guarantee inclusion on Channel Infinity, and that we will be contacted if further information is required.
          </Agreement>
          <Agreement id="agreeTerms" error={err("agreeTerms")} {...register("agreeTerms")}>
            I agree to Channel Infinity&apos;s terms and conditions for content submission.
          </Agreement>
          <Agreement id="agreeGuidelines" error={err("agreeGuidelines")} className="md:pt-[2.5px]" {...register("agreeGuidelines")}>
            I have reviewed and agree to the Channel Infinity Content Guidelines.
          </Agreement>
        </div>
      </section>

      <Button
        type="submit"
        loading={isSubmitting}
        block
        className="mt-9 h-[62px] rounded-[10px] font-sans text-lg font-semibold shadow-[inset_0_0_14px_3px_rgb(240_165_255/0.7),inset_0_-3px_6px_rgb(255_190_255/0.3)] md:mt-[34.75px] md:text-xl"
      >
        {isSubmitting ? "Submitting…" : "Submit Application"}
      </Button>
    </form>
  );
}

function Agreement({
  id,
  error,
  className,
  children,
  ...input
}: ComponentProps<"input"> & { id: string; error?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label className="flex max-w-[776px] cursor-pointer items-start gap-[13px] text-base leading-[18.75px] font-bold text-white">
        <span className="flex shrink-0 pt-[6.5px]">
          <CheckboxBox id={id} invalid={!!error} aria-describedby={describedBy(id, error)} aria-required {...input} />
        </span>
        <span className="relative top-[2px] max-w-[740px]">
          {children}
          <RequiredMark />
        </span>
      </label>
      <FieldError id={id} message={error} className="pl-[25px]" />
    </div>
  );
}
