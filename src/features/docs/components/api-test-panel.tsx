"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Play, Copy, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useApiTestRequest } from "../hooks/use-api-test";

interface ApiTestPanelProps {
  title: string;
  description: string;
  onTest: (makeRequest: ReturnType<typeof useApiTestRequest>['makeRequest']) => void;
  children?: React.ReactNode;
}

export function ApiTestPanel({ title, description, onTest, children }: ApiTestPanelProps) {
  const { makeRequest, isLoading, testResult, clearResult, hasApiKey } = useApiTestRequest();

  const copyResult = () => {
    if (testResult) {
      const resultText = JSON.stringify(testResult.data || { error: testResult.error }, null, 2);
      navigator.clipboard.writeText(resultText);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-4 w-4" />
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
            Please select an application and API key above to test this endpoint.
          </p>
        )}

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
