"use client";
import type { UploadItem } from "../hooks/use-upload";
export type UploadQueueProps = {
  items: UploadItem[];
  onCancel?: (id: string) => void;
  onRetry?: (id: string) => void;
  className?: string;
  itemClassName?: string;
};
export function UploadQueue({
  items,
  onCancel,
  onRetry,
  className,
  itemClassName,
}: UploadQueueProps) {
  return (
    <ul
      className={["fs-upload-list", className].filter(Boolean).join(" ")}
      aria-live="polite"
    >
      {items.map((item) => (
        <li key={item.id} className={itemClassName}>
          <span>{item.file.name}</span>
          <span>
            {item.status} {item.progress ? `${item.progress}%` : ""}
          </span>
          {["queued", "uploading", "processing"].includes(item.status) &&
            onCancel && (
              <button type="button" onClick={() => onCancel(item.id)}>
                Cancel
              </button>
            )}
          {["error", "cancelled"].includes(item.status) && onRetry && (
            <button type="button" onClick={() => onRetry(item.id)}>
              Retry
            </button>
          )}
          {item.error && <span role="alert">{item.error}</span>}
        </li>
      ))}
    </ul>
  );
}
