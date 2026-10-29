"use client";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export type LocationOption = { id: string; name: string; enabled: boolean };
export function StorageLocationSelect({
  value,
  onChange,
  disabled = false,
  className = "",
  inheritedLabel,
  defaultLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  inheritedLabel?: string;
  defaultLabel?: string;
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
    <Select
      value={value || "__inherit__"}
      onValueChange={(value) => onChange(value === "__inherit__" ? "" : value)}
      disabled={disabled}
    >
      <SelectTrigger
        aria-label="Storage location"
        className={`h-10 min-w-40 rounded-md border bg-background px-3 text-sm ${className}`}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {inheritedLabel && (
          <SelectItem value="__inherit__">{inheritedLabel}</SelectItem>
        )}
        {!options.length && (
          <>
            <SelectItem value="default">Default storage</SelectItem>
            <SelectItem value="local">Local storage (this VPS)</SelectItem>
          </>
        )}
        {options.map((option) => (
          <SelectItem
            key={option.id}
            value={option.id}
            disabled={
              !option.enabled && !(option.id === "default" && defaultLabel)
            }
          >
            {option.id === "default" && defaultLabel
              ? defaultLabel
              : option.name}
            {!option.enabled && !(option.id === "default" && defaultLabel)
              ? " — unavailable"
              : ""}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
