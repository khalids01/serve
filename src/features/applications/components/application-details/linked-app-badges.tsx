import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type LinkedApp = {
  id: string;
  name: string;
  slug?: string;
};

const BADGE_COLORS = [
  "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
  "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30",
  "bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/30",
  "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
  "bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border-cyan-500/30",
  "bg-orange-500/15 text-orange-800 dark:text-orange-300 border-orange-500/30",
  "bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-500/30",
];

function badgeColorClass(appId: string): string {
  let hash = 0;
  for (let i = 0; i < appId.length; i++) {
    hash = (hash + appId.charCodeAt(i)) % BADGE_COLORS.length;
  }
  return BADGE_COLORS[hash] ?? BADGE_COLORS[0];
}

interface Props {
  applications?: LinkedApp[];
  className?: string;
  colored?: boolean;
  badgeClassName?: string;
}

export function LinkedAppBadges({
  applications,
  className,
  colored = false,
  badgeClassName,
}: Props) {
  if (!applications || applications.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {applications.map((app) => (
        <Badge
          key={app.id}
          variant="outline"
          className={cn(
            "text-[10px] font-medium",
            badgeClassName,
            colored
              ? badgeColorClass(app.id)
              : "border-transparent bg-secondary text-secondary-foreground",
          )}
        >
          {app.name}
        </Badge>
      ))}
    </div>
  );
}

export function DeleteImageConfirmDescription({
  image,
}: {
  image?: { linkedApplications?: LinkedApp[] } | null;
}) {
  const apps = image?.linkedApplications ?? [];

  if (apps.length > 1) {
    return (
      <div className="space-y-3 text-base text-muted-foreground">
        <p>This image is used by:</p>
        <LinkedAppBadges
          applications={apps}
          colored
          className="gap-2"
          badgeClassName="text-sm px-2.5 py-1"
        />
        <p>
          Deleting will permanently remove it from all applications and from
          storage.
        </p>
      </div>
    );
  }

  if (apps.length === 1) {
    return (
      <div className="space-y-3 text-base text-muted-foreground">
        <p>This image is linked to:</p>
        <LinkedAppBadges
          applications={apps}
          colored
          className="gap-2"
          badgeClassName="text-sm px-2.5 py-1"
        />
        <p>
          Deleting will permanently remove the file and its variants from
          storage and the database.
        </p>
      </div>
    );
  }

  return (
    <p className="text-base text-muted-foreground">
      This will permanently delete the file and its variants from storage and
      the database.
    </p>
  );
}
