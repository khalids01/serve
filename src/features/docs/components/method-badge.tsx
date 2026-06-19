import { cn } from "@/lib/utils";

const methodStyles = {
  GET: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  POST: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  DELETE: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  PATCH: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  PUT: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
} as const;

type HttpMethod = keyof typeof methodStyles;

type MethodBadgeProps = {
  method: HttpMethod | string;
  className?: string;
};

export function MethodBadge({ method, className }: MethodBadgeProps) {
  const normalized = method.toUpperCase() as HttpMethod;
  const style =
    methodStyles[normalized] ??
    "bg-muted text-foreground";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2.5 py-0.5 text-xs font-semibold tracking-wide",
        style,
        className,
      )}
    >
      {normalized}
    </span>
  );
}
