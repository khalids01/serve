"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Play, Copy, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import type { Application, ApiKey } from "@/lib/prisma-types";

interface ApiTesterProps {
  applications: (Application & { apiKeys: ApiKey[] })[];
}

interface TestResult {
  success: boolean;
  data?: any;
  error?: string;
  status?: number;
  duration?: number;
}

export function ApiTester({ applications }: ApiTesterProps) {
  const [selectedApp, setSelectedApp] = useState<string>("");
  const [selectedApiKey, setSelectedApiKey] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [tags, setTags] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const selectedApplication = applications.find(app => app.id === selectedApp);
  const availableApiKeys = selectedApplication?.apiKeys || [];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 5,
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
    }
  });

  const handleTest = async () => {
    if (!selectedApp || !selectedApiKey || files.length === 0) {
      setTestResult({
        success: false,
        error: "Please select an application, API key, and upload at least one file"
      });
      return;
    }

    setIsLoading(true);
    const startTime = Date.now();

    try {
      const formData = new FormData();
      
      // Add files to form data
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

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'x-api-key': selectedApiKey,
        },
        body: formData
      });

      const data = await response.json();
      const duration = Date.now() - startTime;

      setTestResult({
        success: response.ok,
        data: response.ok ? data : undefined,
        error: !response.ok ? data.error || 'Upload failed' : undefined,
        status: response.status,
        duration
      });

    } catch (error) {
      const duration = Date.now() - startTime;
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        duration
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyApiKey = () => {
    if (selectedApiKey) {
      navigator.clipboard.writeText(selectedApiKey);
    }
  };

  const copyResult = () => {
    if (testResult) {
      const resultText = JSON.stringify(testResult.data || { error: testResult.error }, null, 2);
      navigator.clipboard.writeText(resultText);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          API Tester
        </CardTitle>
        <CardDescription>
          Test the upload API with your applications and API keys
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Application & API Key Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="application">Application</Label>
            <Select value={selectedApp} onValueChange={(value) => {
              setSelectedApp(value);
              setSelectedApiKey("");
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select application" />
              </SelectTrigger>
              <SelectContent>
                {applications.map((app) => (
                  <SelectItem key={app.id} value={app.id}>
                    {app.name} ({app.slug})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apikey">API Key</Label>
            <div className="flex gap-2">
              <Select 
                value={selectedApiKey} 
                onValueChange={setSelectedApiKey}
                disabled={!selectedApp}
              >
                <SelectTrigger>
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
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

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

        {/* Test Button */}
        <Button 
          onClick={handleTest} 
          disabled={!selectedApp || !selectedApiKey || files.length === 0 || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Upload...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Test Upload API
            </>
          )}
        </Button>

        {/* Test Result */}
        {testResult && (
          <Card className={testResult.success ? "border-green-200" : "border-red-200"}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  {testResult.success ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Success
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      Error
                    </>
                  )}
                  {testResult.status && (
                    <Badge variant={testResult.success ? "default" : "destructive"}>
                      {testResult.status}
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {testResult.duration && (
                    <span className="text-sm text-muted-foreground">
                      {testResult.duration}ms
                    </span>
                  )}
                  <Button variant="outline" size="sm" onClick={copyResult}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                readOnly
                value={JSON.stringify(testResult.data || { error: testResult.error }, null, 2)}
                className="font-mono text-sm min-h-[200px]"
              />
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
