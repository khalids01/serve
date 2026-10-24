"use client";

import { Files, Key, LayoutDashboard, Settings, Upload } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApplicationApiKeys } from "./application-details/api-keys-tab";
import { ApplicationHeader } from "./application-details/header";
import { ApplicationOverview } from "./application-details/overview-tab";
import type {
  ApplicationDTO,
  AuditLogItemDTO,
  CacheResponse,
  ImageFileDTO,
} from "./application-details/types";
import { ApplicationUpload } from "./application-details/upload-tab";
import { ApplicationSettingsForm } from "./application-settings-form";

const VALID_TABS = ["overview", "files", "keys", "upload", "settings"] as const;
type TabValue = (typeof VALID_TABS)[number];

const TAB_CONFIG: {
  value: TabValue;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { value: "overview", label: "Overview", icon: LayoutDashboard },
  { value: "files", label: "Files", icon: Files },
  { value: "keys", label: "API keys", icon: Key },
  { value: "upload", label: "Upload", icon: Upload },
  { value: "settings", label: "Settings", icon: Settings },
];

interface Props {
  application: ApplicationDTO;
  images: ImageFileDTO[];
  activity: AuditLogItemDTO[];
  cacheData: CacheResponse | null;
}

function parseTab(value: string | null): TabValue {
  if (value && VALID_TABS.includes(value as TabValue)) {
    return value as TabValue;
  }
  return "overview";
}

export default function ApplicationDetailsClient({
  application,
  images,
  activity,
  cacheData,
}: Props) {
  const applicationId = application.id;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab = parseTab(searchParams.get("tab"));
  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "overview") params.delete("tab");
    else params.set("tab", parseTab(value));
    params.delete("view");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  return (
    <div className="min-h-screen">
      <main className="container mx-auto py-8">
        <ApplicationHeader application={application} />

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5 h-auto p-1">
            {TAB_CONFIG.map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                aria-label={label}
                title={label}
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 py-2 px-1 sm:px-3"
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline text-xs sm:text-sm">
                  {label}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview">
            <ApplicationOverview
              application={application}
              images={images}
              activity={activity}
              cacheData={cacheData}
            />
          </TabsContent>

          <TabsContent value="files">
            <div className="rounded-xl border p-8">
              <h2 className="mb-2 text-lg font-semibold">
                Application file manager
              </h2>
              <p className="mb-4 text-muted-foreground">
                Browse folders, upload files, and manage storage locations.
              </p>
              <Link
                className="inline-flex rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
                href={`/dashboard/files?applicationId=${applicationId}`}
              >
                Open file manager
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="keys">
            <ApplicationApiKeys applicationId={applicationId} />
          </TabsContent>

          <TabsContent value="upload">
            <ApplicationUpload applicationId={applicationId} />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Application Settings</CardTitle>
                <CardDescription>
                  Update your application configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ApplicationSettingsForm application={application} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
