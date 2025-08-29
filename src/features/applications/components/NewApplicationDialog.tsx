"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useApplicationData, generateSlug } from "@/features/applications/hooks/use-application-data";

export function NewApplicationDialog({
  triggerLabel = "New Application",
}: {
  triggerLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const {
    createMutation: { mutateAsync, isPending },
  } = useApplicationData();

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(val));
    }
  };

  const create = async () => {
    if (!name.trim() || !slug.trim()) {
      toast.error("Please enter both name and slug");
      return;
    }
    try {
      await mutateAsync({
        name,
        slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      });
      toast.success("Application created successfully");
      setName("");
      setSlug("");
      setOpen(false);
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Failed to create application");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Application</DialogTitle>
          <DialogDescription>
            Create a new application to organize your files and manage API
            access.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="appName" className="mb-2">
              Application Name
            </Label>
            <Input
              id="appName"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., My Website, Mobile App"
            />
          </div>
          <div>
            <Label htmlFor="appSlug" className="mb-2">
              Slug (URL identifier)
            </Label>
            <Input
              id="appSlug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g., my-website, mobile-app"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Used in API URLs and file paths. Only lowercase letters, numbers,
              and hyphens.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={create} disabled={isPending}>
            {isPending ? "Creating..." : "Create Application"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
