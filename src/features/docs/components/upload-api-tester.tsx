"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { ApiTestPanel } from "./api-test-panel";

export function UploadApiTester() {
  const [files, setFiles] = useState<File[]>([]);
  const [tags, setTags] = useState<string>("");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 5,
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
    }
  });

  const handleTest = async (makeRequest: any) => {
    if (files.length === 0) {
      return;
    }

    const formData = new FormData();
    
    if (files.length === 1) {
      // Single file format
      formData.append('file', files[0]);
      if (tags.trim()) {
        formData.append('tags', JSON.stringify(tags.split(',').map(t => t.trim()).filter(Boolean)));
      }
    } else {
      // Multiple files format
      const fileConfigs = files.map((file, index) => ({
        file: `file_${index}`,
        tags: tags.trim() ? tags.split(',').map(t => t.trim()).filter(Boolean) : undefined
      }));
      
      formData.append('files', JSON.stringify(fileConfigs));
      files.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });
    }

    await makeRequest('/api/upload', 'POST', formData);
  };

  return (
    <ApiTestPanel
      title="Test Upload API"
      description="Upload images with your selected API key"
      onTest={handleTest}
    >
      {/* File Upload */}
      <div className="space-y-2">
        <Label>Files to Upload</Label>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? "border-primary bg-primary/5" 
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          {isDragActive ? (
            <p>Drop the files here...</p>
          ) : (
            <div>
              <p>Drag & drop images here, or click to select</p>
              <p className="text-sm text-muted-foreground mt-1">
                Supports: PNG, JPG, JPEG, GIF, WebP (max 5 files)
              </p>
            </div>
          )}
        </div>
        
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {files.map((file, index) => (
              <Badge key={index} variant="secondary">
                {file.name} ({Math.round(file.size / 1024)}KB)
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label htmlFor="tags">Tags (optional)</Label>
        <Input
          id="tags"
          placeholder="tag1, tag2, tag3"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          Comma-separated tags to associate with uploaded images
        </p>
      </div>
    </ApiTestPanel>
  );
}
