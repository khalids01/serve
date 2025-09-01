"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiTestPanel } from "./api-test-panel";

export function GetImageApiTester() {
  const [imageId, setImageId] = useState<string>("");

  const handleTest = async (makeRequest: any) => {
    if (!imageId.trim()) {
      return;
    }
    await makeRequest(`/api/images/${imageId.trim()}`, 'GET');
  };

  return (
    <ApiTestPanel
      title="Test Get Image API"
      description="Retrieve a specific image by ID with your selected API key"
      onTest={handleTest}
    >
      <div className="space-y-2">
        <Label htmlFor="image-id">Image ID</Label>
        <Input
          id="image-id"
          placeholder="img_123456789"
          value={imageId}
          onChange={(e) => setImageId(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          Enter the ID of an image from your application
        </p>
      </div>
    </ApiTestPanel>
  );
}
