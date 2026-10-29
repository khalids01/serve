"use client";
import { type UploadOptions, useUpload } from "../hooks/use-upload";
import { FilePicker, type FilePickerProps } from "./file-picker";
import { UploadQueue } from "./upload-queue";

export type { UploadItem } from "../hooks/use-upload";
export type FileUploaderProps = Pick<
  FilePickerProps,
  | "accept"
  | "multiple"
  | "maxFiles"
  | "maxSizeBytes"
  | "disabled"
  | "children"
  | "onReject"
> &
  UploadOptions & {
    className?: string;
    pickerClassName?: string;
    queueClassName?: string;
  };
export function FileUploader({
  tags,
  storageLocationId,
  parallel,
  onUploadComplete,
  onBatchComplete,
  className,
  pickerClassName,
  queueClassName,
  ...picker
}: FileUploaderProps) {
  const { items, upload, cancel, retry } = useUpload({
    tags,
    storageLocationId,
    parallel,
    onUploadComplete,
    onBatchComplete,
  });
  return (
    <div className={["fs-uploader", className].filter(Boolean).join(" ")}>
      <FilePicker
        {...picker}
        className={pickerClassName}
        onFiles={(files) => {
          void upload(files);
        }}
      />
      <UploadQueue
        items={items}
        onCancel={cancel}
        onRetry={retry}
        className={queueClassName}
      />
    </div>
  );
}
