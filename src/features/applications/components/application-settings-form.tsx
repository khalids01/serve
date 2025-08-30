"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ApplicationDTO } from "./application-details-client";

interface Props {
  application: ApplicationDTO;
}

export function ApplicationSettingsForm({ application }: Props) {
  const router = useRouter();
  const [name, setName] = useState(application.name);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Application name is required");
      return;
    }

    if (name === application.name) {
      toast.info("No changes to save");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/applications/${application.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update application");
      }

      toast.success("Application updated successfully");
      router.refresh();
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update application");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setName(application.name);
  };

  const hasChanges = name !== application.name;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Application Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter application name"
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">
          This is the display name for your application.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Application Slug</Label>
        <Input
          value={application.slug}
          disabled
          className="bg-muted"
        />
        <p className="text-xs text-muted-foreground">
          The slug cannot be changed as it determines the storage directory path.
        </p>
      </div>

      <div className="flex gap-2">
        <Button 
          type="submit" 
          disabled={!hasChanges || isLoading}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleReset}
          disabled={!hasChanges || isLoading}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
