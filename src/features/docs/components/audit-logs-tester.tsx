"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApiTestPanel } from "./api-test-panel";

export function AuditLogsApiTester() {
  const [action, setAction] = useState<string>("");
  const [limit, setLimit] = useState<string>("10");

  const handleTest = async (makeRequest: any) => {
    const params = new URLSearchParams();
    
    if (action.trim() && action !== "all") params.append('action', action.trim());
    if (limit.trim()) params.append('limit', limit.trim());

    const endpoint = `/api/audit-logs${params.toString() ? `?${params.toString()}` : ''}`;
    await makeRequest(endpoint, 'GET');
  };

  return (
    <ApiTestPanel
      title="Test Audit Logs API"
      description="Retrieve audit logs for your application with your selected API key"
      onTest={handleTest}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="action">Action Filter (optional)</Label>
          <Select value={action} onValueChange={setAction}>
            <SelectTrigger>
              <SelectValue placeholder="All actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All actions</SelectItem>
              <SelectItem value="UPLOAD">UPLOAD</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
              <SelectItem value="LOGIN">LOGIN</SelectItem>
              <SelectItem value="GENERATE_KEY">GENERATE_KEY</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="audit-limit">Limit</Label>
          <Input
            id="audit-limit"
            type="number"
            placeholder="10"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
          />
        </div>
      </div>
    </ApiTestPanel>
  );
}
