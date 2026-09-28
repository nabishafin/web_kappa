"use client";

import { FileIcon, X } from "lucide-react";
import { useId, useRef, useState, type DragEvent } from "react";
import { cn } from "@/lib/utils";

export const MAX_FILES = 10;
export const MAX_FILE_BYTES = 100 * 1024 * 1024;

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let v = bytes / 1024;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v >= 10 ? Math.round(v) : v.toFixed(1)} ${units[i]}`;
}

const fileKey = (f: File) => `${f.name}:${f.size}:${f.lastModified}`;

/**
 * Dashed-violet drop target around a real `<input type="file" multiple>`.
 * Supports click / keyboard (the native input stays focusable) and drag & drop,
 * de-duplicates, and enforces ≤ MAX_FILES files and ≤ 100 MB per file.
 */
export function Dropzone({
  id,
  files,
  onFilesChange,
  accept,
  labelledBy,
  className,
}: {
  id: string;
  files: File[];
  onFilesChange: (files: File[]) => void;
  accept?: string;
  /** id of the visible field label */
  labelledBy?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hintId = useId();
  const [dragging, setDragging] = useState(false);
  const [problems, setProblems] = useState<string[]>([]);

  function add(list: FileList | null) {
    if (!list?.length) return;
    const next = [...files];
    const errs: string[] = [];
    const seen = new Set(next.map(fileKey));
    for (const f of Array.from(list)) {
      if (seen.has(fileKey(f))) continue;
      if (f.size > MAX_FILE_BYTES) {
        errs.push(`“${f.name}” is ${formatBytes(f.size)} — the limit is 100 MB per file.`);
        continue;
      }
      if (next.length >= MAX_FILES) {
        errs.push(`You can upload up to ${MAX_FILES} files. “${f.name}” was not added.`);
        continue;
      }
      seen.add(fileKey(f));
      next.push(f);
    }
    setProblems(errs);
    if (next.length !== files.length) onFilesChange(next);
  }

  function remove(index: number) {
    setProblems([]);
    onFilesChange(files.filter((_, i) => i !== index));
    inputRef.current?.focus();
  }

  const onDrag = (e: DragEvent<HTMLDivElement>, over: boolean) => {
    if (!Array.from(e.dataTransfer.types).includes("Files")) return;
    e.preventDefault();
    setDragging(over);
  };

  const status = files.length === 0 ? "No file chosen" : files.length === 1 ? files[0].name : `${files.length} files chosen`;

  return (
    <div
      onDragEnter={(e) => onDrag(e, true)}
      onDragOver={(e) => onDrag(e, true)}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        add(e.dataTransfer.files);
      }}
      className={cn(
        "rounded-[8px] border-2 border-dashed border-[#c77dff] bg-[#1b1620] px-4 pt-[25px] pb-[34px] transition-colors md:px-[33px]",
        dragging && "border-[#e2b8ff] bg-[#2a1f36]",
        className,
      )}
    >
      {/* clicking anywhere in the box opens the picker; the native input keeps focus + a11y */}
      <div
        onClick={() => inputRef.current?.click()}
        className="flex min-h-[67px] cursor-pointer items-center gap-[5px] rounded-[8px] border-2 border-[#4c4a50] bg-[#332f37] px-[18px] py-3 font-roboto text-base text-white transition-colors hover:border-[#6a6570] has-focus-visible:border-lilac has-focus-visible:shadow-[0_0_0_3px_rgb(199_125_255/0.3)]"
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          multiple
          accept={accept}
          aria-labelledby={labelledBy}
          aria-describedby={hintId}
          className="sr-only"
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            add(e.currentTarget.files);
            e.currentTarget.value = ""; // allow re-selecting the same file
          }}
        />
        <span aria-hidden className="shrink-0 border border-black bg-[#efefef] px-[6px] py-[1px] leading-[23px] text-black">
          Choose Files
        </span>
        <span aria-hidden className="min-w-0 truncate">
          {status}
        </span>
      </div>

      <p id={hintId} className="mt-[6px] text-center text-[13.5px] leading-4 text-[#bebdbf]">
        {dragging ? "Drop files to add them" : `Upload up to ${MAX_FILES} supported files. Max 100 MB per file.`}
      </p>

      <div aria-live="polite">
        {problems.length > 0 && (
          <ul role="alert" className="mt-3 space-y-1 text-center text-sm text-[#ff6b6b]">
            {problems.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        )}
      </div>

      {files.length > 0 && (
        <ul aria-label="Chosen files" className="mt-4 space-y-2">
          {files.map((f, i) => (
            <li
              key={fileKey(f)}
              className="flex animate-fade-in items-center gap-3 rounded-[8px] border border-[#3a3440] bg-[#241e2b] py-2 pr-2 pl-3 text-sm text-white"
            >
              <FileIcon aria-hidden className="size-4 shrink-0 text-[#c77dff]" />
              <span className="min-w-0 flex-1 truncate">{f.name}</span>
              <span className="shrink-0 text-xs text-[#bebdbf] tabular-nums">{formatBytes(f.size)}</span>
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label={`Remove ${f.name}`}
                className="grid size-7 shrink-0 place-items-center rounded-md text-[#bebdbf] transition-colors hover:bg-white/10 hover:text-white"
              >
                <X aria-hidden className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
