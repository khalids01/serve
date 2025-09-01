"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiTestPanel } from "./api-test-panel";

export function ListImagesApiTester() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [limit, setLimit] = useState<string>("10");

  const handleTest = async (makeRequest: any) => {
    const params = new URLSearchParams();
    
    if (searchQuery.trim()) params.append('q', searchQuery.trim());
    if (tags.trim()) params.append('tags', tags.trim());
    if (limit.trim()) params.append('limit', limit.trim());

    const endpoint = `/api/images${params.toString() ? `?${params.toString()}` : ''}`;
    await makeRequest(endpoint, 'GET');
  };

  return (
    <ApiTestPanel
      title="Test List Images API"
      description="Search and filter images with your selected API key"
      onTest={handleTest}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search Query (optional)</Label>
          <Input
            id="search"
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="filter-tags">Tags (optional)</Label>
          <Input
            id="filter-tags"
            placeholder="tag1,tag2"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="limit">Limit</Label>
          <Input
            id="limit"
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
