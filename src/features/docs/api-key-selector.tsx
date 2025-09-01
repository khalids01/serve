"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Copy, Key } from "lucide-react";
import { useApiTest } from "./api-test-provider";

export function ApiKeySelector() {
  const { apiKey, setApiKey } = useApiTest();

  const copyApiKey = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-muted/30 border-b">
      <div className="flex items-center gap-2">
        <Key className="h-4 w-4" />
        <span className="text-sm font-medium">API Testing:</span>
      </div>
      
      <div className="flex items-center gap-3 flex-1">
        <Label htmlFor="api-key" className="text-sm">API Key:</Label>
        <Input
          id="api-key"
          type="password"
          placeholder="sk_live_..."
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="flex-1 max-w-md"
        />
        {apiKey && (
          <Button variant="outline" size="sm" onClick={copyApiKey}>
            <Copy className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}
