"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Copy, Key } from "lucide-react";
import { useApiTest } from "./api-test-provider";

export function ApiKeySelector() {
  const { 
    selectedApp, 
    selectedApiKey, 
    setSelectedApp, 
    setSelectedApiKey, 
    applications,
    getSelectedApplication 
  } = useApiTest();

  const selectedApplication = getSelectedApplication();
  const availableApiKeys = selectedApplication?.apiKeys || [];

  const copyApiKey = () => {
    if (selectedApiKey) {
      navigator.clipboard.writeText(selectedApiKey);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-muted/30 border-b">
      <div className="flex items-center gap-2">
        <Key className="h-4 w-4" />
        <span className="text-sm font-medium">API Testing:</span>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Label htmlFor="app-select" className="text-sm">App:</Label>
          <Select value={selectedApp} onValueChange={setSelectedApp}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select application" />
            </SelectTrigger>
            <SelectContent>
              {applications.map((app) => (
                <SelectItem key={app.id} value={app.id}>
                  {app.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="key-select" className="text-sm">Key:</Label>
          <Select 
            value={selectedApiKey} 
            onValueChange={setSelectedApiKey}
            disabled={!selectedApp}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select API key" />
            </SelectTrigger>
            <SelectContent>
              {availableApiKeys.map((key) => (
                <SelectItem key={key.id} value={key.hash}>
                  {key.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedApiKey && (
            <Button variant="outline" size="sm" onClick={copyApiKey}>
              <Copy className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
