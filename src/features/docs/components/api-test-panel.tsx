"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { CodeBlock } from "@/features/docs/code-block";
import { useApiTestRequest } from "../hooks/use-api-test";

interface ApiTestPanelProps {
  title: string;
  description: string;
  onTest: (
    makeRequest: ReturnType<typeof useApiTestRequest>["makeRequest"],
  ) => void;
  children?: React.ReactNode;
}

export function ApiTestPanel({
  title,
  description,
  onTest,
  children,
}: ApiTestPanelProps) {
  const { makeRequest, isLoading, testResult, clearResult, hasApiKey } =
    useApiTestRequest();

  const resultJson = testResult
    ? JSON.stringify(
        testResult.data || { error: testResult.error },
        null,
        2,
      )
    : "";

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}

        <div className="flex gap-2">
          <Button
            onClick={() => onTest(makeRequest)}
            disabled={!hasApiKey || isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Test API
              </>
            )}
          </Button>
          {testResult && (
            <Button variant="outline" onClick={clearResult}>
              Clear
            </Button>
          )}
        </div>

        {!hasApiKey && (
          <p className="text-sm text-muted-foreground">
            Select an application and API key above to test this endpoint.
          </p>
        )}

        {testResult && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {testResult.success ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Success</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium">Error</span>
                </>
              )}
              {testResult.status && (
                <Badge variant={testResult.success ? "default" : "destructive"}>
                  {testResult.status}
                </Badge>
              )}
              {testResult.duration && (
                <span className="text-sm text-muted-foreground">
                  {testResult.duration}ms
                </span>
              )}
            </div>
            <CodeBlock code={resultJson} language="json" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
