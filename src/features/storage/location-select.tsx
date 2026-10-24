"use client";
import { useEffect, useState } from "react";
export type LocationOption = { id: string; name: string; enabled: boolean };
export function StorageLocationSelect({
  value,
  onChange,
  disabled = false,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  const [options, setOptions] = useState<LocationOption[]>([]);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/storage-connections", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        const data = await response.json();
        setOptions([...data.builtins, ...data.connections]);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);
  return (
    <select
      aria-label="Storage location"
      className={`h-10 min-w-40 rounded-md border bg-background px-3 text-sm ${className}`}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
    >
      {!options.length && (
        <>
          <option value="default">Default storage</option>
          <option value="local">Local storage (this VPS)</option>
        </>
      )}
      {options.map((option) => (
        <option key={option.id} value={option.id} disabled={!option.enabled}>
          {option.name}
          {!option.enabled ? " — unavailable" : ""}
        </option>
      ))}
    </select>
  );
}
