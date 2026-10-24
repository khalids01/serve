"use client";
import { useId, useRef, useState } from "react";
import { cn } from "../lib/cn";

export type FileRejection = {
  file: File;
  code:
    | "too-many-files"
    | "file-too-large"
    | "file-type-not-allowed"
    | "duplicate-file";
  message: string;
};
export type FilePickerProps = {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeBytes?: number;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  children?: React.ReactNode;
  onFiles: (files: File[]) => void;
  onReject?: (rejections: FileRejection[]) => void;
};

function allows(file: File, accept?: string) {
  if (!accept) return true;
  return accept
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .some((rule) => {
      if (rule.endsWith("/*")) return file.type.startsWith(rule.slice(0, -1));
      if (rule.startsWith("."))
        return file.name.toLowerCase().endsWith(rule.toLowerCase());
      return file.type === rule;
    });
}

export function FilePicker({
  accept,
  multiple = false,
  maxFiles = multiple ? Infinity : 1,
  maxSizeBytes,
  disabled,
  className,
  inputClassName,
  children,
  onFiles,
  onReject,
}: FilePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const [dragging, setDragging] = useState(false);
  const select = (source: File[]) => {
    const accepted: File[] = [];
    const rejected: FileRejection[] = [];
    const seen = new Set<string>();
    source.forEach((file) => {
      const key = `${file.name}:${file.size}:${file.lastModified}`;
      if (seen.has(key)) {
        rejected.push({
          file,
          code: "duplicate-file",
          message: `${file.name} was already selected.`,
        });
        return;
      }
      seen.add(key);
      if (accepted.length >= Math.min(maxFiles, multiple ? Infinity : 1))
        rejected.push({
          file,
          code: "too-many-files",
          message: `Select at most ${maxFiles} file(s).`,
        });
      else if (maxSizeBytes && file.size > maxSizeBytes)
        rejected.push({
          file,
          code: "file-too-large",
          message: `${file.name} exceeds the allowed size.`,
        });
      else if (!allows(file, accept))
        rejected.push({
          file,
          code: "file-type-not-allowed",
          message: `${file.name} is not an accepted type.`,
        });
      else accepted.push(file);
    });
    if (accepted.length) onFiles(accepted);
    if (rejected.length) onReject?.(rejected);
    if (inputRef.current) inputRef.current.value = "";
  };
  return (
    <fieldset
      aria-label="File selection"
      className={cn(
        "fs-picker",
        dragging && "fs-picker--dragging",
        disabled && "fs-picker--disabled",
        className,
      )}
      onPaste={(event) => {
        if (!disabled && event.clipboardData.files.length) {
          event.preventDefault();
          select([...event.clipboardData.files]);
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        if (!disabled) select([...event.dataTransfer.files]);
      }}
    >
      <input
        ref={inputRef}
        id={id}
        className={cn("fs-sr-only", inputClassName)}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(event) => select([...(event.currentTarget.files ?? [])])}
      />
      <label htmlFor={id} className="fs-picker__label">
        {children ?? (
          <>
            <strong>Choose files</strong>
            <span>or drag and drop</span>
          </>
        )}
      </label>
    </fieldset>
  );
}
