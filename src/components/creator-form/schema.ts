import { z } from "zod";
import type { SelectOption } from "./select";

/* ------------------------------------------------------------------ options */

export const contentTypes = [
  { value: "series", label: "Series" },
  { value: "movie", label: "Movie" },
  { value: "short-film", label: "Short Film" },
  { value: "pilot", label: "Pilot" },
  { value: "web-series", label: "Web Series" },
  { value: "anthology", label: "Anthology" },
] as const satisfies readonly SelectOption[];

export const genres = [
  { value: "sci-fi", label: "Sci-fi" },
  { value: "fantasy", label: "Fantasy" },
  { value: "comedy", label: "Comedy" },
  { value: "drama", label: "Drama" },
  { value: "thriller", label: "Thriller" },
  { value: "horror", label: "Horror" },
  { value: "action-adventure", label: "Action and Adventure" },
  { value: "romance", label: "Romance" },
  { value: "musical", label: "Musical" },
  { value: "educational", label: "Educational" },
] as const satisfies readonly SelectOption[];

export const audiences = [
  { value: "preschool", label: "Preschool (0–5)" },
  { value: "kids", label: "Kids (6–12)" },
  { value: "teens", label: "Teens (13–17)" },
  { value: "young-adults", label: "Young Adults (18–24)" },
  { value: "adults", label: "Adults (18+)" },
  { value: "family", label: "All Ages / Family" },
] as const satisfies readonly SelectOption[];

export const ratings = [
  { value: "g", label: "G / TV-G" },
  { value: "pg", label: "PG / TV-PG" },
  { value: "pg13", label: "PG-13 / TV-14" },
  { value: "r", label: "R / TV-MA" },
] as const satisfies readonly SelectOption[];

export const contentWarnings = [
  { value: "suggestive-dialogue", label: "Suggestive dialogue" },
  { value: "foul-language", label: "Foul language" },
  { value: "sexual-content", label: "Sexual content" },
  { value: "graphic-violence", label: "Graphic Violence" },
] as const satisfies readonly SelectOption[];

export const subtitleOptions = [
  { value: "english", label: "Yes — English" },
  { value: "multiple", label: "Yes — multiple languages" },
  { value: "in-progress", label: "In progress" },
  { value: "none", label: "No subtitles" },
] as const satisfies readonly SelectOption[];

export const yesNo = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
] as const satisfies readonly SelectOption[];

export const exclusivityOptions = [...yesNo, { value: "not-available", label: "Not Available" }] as const satisfies readonly SelectOption[];

export const OTHER = "other";

/* ------------------------------------------------------------------- schema */

const required = (label: string) => z.string().trim().min(1, `${label} is required.`);
const httpUrl = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .pipe(z.url({ protocol: /^https?$/, hostname: z.regexes.domain, error: "Enter a valid URL starting with http:// or https://." }));
const optionalHttpUrl = z
  .string()
  .trim()
  .refine((v) => v === "" || z.url({ protocol: /^https?$/, hostname: z.regexes.domain }).safeParse(v).success, {
    error: "Enter a valid URL starting with http:// or https://.",
  });
const oneOf = (options: readonly SelectOption[], message: string) =>
  z.string().refine((v) => options.some((o) => o.value === v), { error: message });
const mustAgree = z.boolean().refine((v) => v, { error: "Please confirm to continue." });

export const applicationSchema = z
  .object({
    companyName: required("Company name"),
    companyWebsite: httpUrl("Company website"),
    contactPerson: required("Contact person"),
    contactEmail: z.string().trim().min(1, "Contact email is required.").pipe(z.email({ error: "Enter a valid email address." })),
    contactPhone: z
      .string()
      .trim()
      .min(1, "Contact phone number is required.")
      .regex(/^\+?[\d\s().-]+$/, "Use digits, spaces and + ( ) - only.")
      .refine((v) => {
        const digits = v.replace(/\D/g, "").length;
        return digits >= 7 && digits <= 15;
      }, "Enter a valid phone number (7–15 digits)."),

    contentType: oneOf(contentTypes, "Select a content type."),
    title: required("Title"),
    genres: z.array(z.string()).min(1, "Select at least one genre."),
    genreOther: z.string().trim().max(60, "Keep it under 60 characters."),
    description: required("Description").pipe(z.string().min(30, "Please write at least 30 characters.")),
    targetAudience: oneOf(audiences, "Select a target audience."),
    contentRating: oneOf(ratings, "Select a content rating."),
    warnings: z.array(z.string()),
    warningOther: z.string().trim().max(60, "Keep it under 60 characters."),
    awards: required("Awards or recognitions (write “None” if not applicable)"),
    showLink: httpUrl("Link"),
    runtime: required("Episode count or movie length"),
    languages: required("Languages"),
    subtitles: oneOf(subtitleOptions, "Select subtitle availability."),
    contentLink: optionalHttpUrl,
    availableElsewhere: oneOf(yesNo, "Please choose Yes or No."),
    platforms: z.string().trim(),

    driveLinks: z.string(),
    licensing: z.string().trim(),
    exclusivity: z.string(),
    fit: required("This answer"),
    comments: z.string().trim(),

    agreeRights: mustAgree,
    agreeTerms: mustAgree,
    agreeGuidelines: mustAgree,
  })
  .superRefine((v, ctx) => {
    if (v.genres.includes(OTHER) && !v.genreOther)
      ctx.addIssue({ code: "custom", path: ["genreOther"], message: "Please specify the other genre." });
    if (v.warnings.includes(OTHER) && !v.warningOther)
      ctx.addIssue({ code: "custom", path: ["warningOther"], message: "Please specify the other content warning." });
    if (v.availableElsewhere === "yes" && !v.platforms)
      ctx.addIssue({ code: "custom", path: ["platforms"], message: "Tell us where it is currently available." });
    const bad = v.driveLinks
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .find((l) => !z.url({ protocol: /^https?$/ }).safeParse(l).success);
    if (bad) ctx.addIssue({ code: "custom", path: ["driveLinks"], message: `“${bad}” is not a valid link. Put one URL per line.` });
  });

export type ApplicationValues = z.infer<typeof applicationSchema>;

export const emptyApplication: ApplicationValues = {
  companyName: "",
  companyWebsite: "",
  contactPerson: "",
  contactEmail: "",
  contactPhone: "",
  contentType: "",
  title: "",
  genres: [],
  genreOther: "",
  description: "",
  targetAudience: "",
  contentRating: "",
  warnings: [],
  warningOther: "",
  awards: "",
  showLink: "",
  runtime: "",
  languages: "",
  subtitles: "",
  contentLink: "",
  availableElsewhere: "",
  platforms: "",
  driveLinks: "",
  licensing: "",
  exclusivity: "",
  fit: "",
  comments: "",
  agreeRights: false,
  agreeTerms: false,
  agreeGuidelines: false,
};

/* -------------------------------------------------------------------- draft */

export const DRAFT_KEY = "ci.creator-application.draft.v1";

/** Parse a stored draft defensively: unknown keys are dropped, wrong types fall back to empty. */
export function readDraft(raw: string | null): ApplicationValues | null {
  if (!raw) return null;
  try {
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== "object") return null;
    const src = data as Record<string, unknown>;
    const out: Record<string, unknown> = { ...emptyApplication };
    for (const [k, empty] of Object.entries(emptyApplication)) {
      const v = src[k];
      if (Array.isArray(empty) ? Array.isArray(v) && v.every((x) => typeof x === "string") : typeof v === typeof empty) out[k] = v;
    }
    return out as ApplicationValues;
  } catch {
    return null;
  }
}
