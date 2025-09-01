"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiTestPanel } from "./api-test-panel";

export function DeleteImageApiTester() {
  const [imageId, setImageId] = useState<string>("");

  const handleTest = async (makeRequest: any) => {
    if (!imageId.trim()) {
      return;
    }
    await makeRequest(`/api/images/${imageId.trim()}`, 'DELETE');
  };

  return (
    <ApiTestPanel
      title="Test Delete Image API"
      description="Delete a specific image by ID with your selected API key"
      onTest={handleTest}
    >
      <div className="space-y-2">
        <Label htmlFor="delete-image-id">Image ID</Label>
        <Input
          id="delete-image-id"
          placeholder="img_123456789"
          value={imageId}
          onChange={(e) => setImageId(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          Enter the ID of an image to delete from your application
        </p>
      </div>
    </ApiTestPanel>
  );
}
