import { FolderOpen } from "lucide-react";
import { ApplicationDTO } from "./types";

interface Props {
  application: ApplicationDTO;
}

export function ApplicationHeader({ application }: Props) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
          <FolderOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>

        <div>
          <h1 className="text-3xl font-bold">{application.name}</h1>
          <p className="text-muted-foreground">
            {application.slug} • Created {formatDate(application.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
