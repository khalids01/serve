"use client";

import { useState } from "react";
import { useApiTest } from "../api-test-provider";

interface TestResult {
  success: boolean;
  data?: any;
  error?: string;
  status?: number;
  duration?: number;
  headers?: Record<string, string>;
}

export function useApiTestRequest() {
  const { apiKey } = useApiTest();
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const makeRequest = async (
    endpoint: string,
    method: 'GET' | 'POST' | 'DELETE' = 'GET',
    body?: FormData | string,
    additionalHeaders?: Record<string, string>
  ) => {
    if (!apiKey.trim()) {
      setTestResult({
        success: false,
        error: "Please enter your API key"
      });
      return;
    }

    setIsLoading(true);
    const startTime = Date.now();

    try {
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${apiKey}`,
        ...additionalHeaders
      };

      // Don't set Content-Type for FormData, let browser set it
      if (typeof body === 'string') {
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(endpoint, {
        method,
        headers,
        body
      });

      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      const duration = Date.now() - startTime;

      setTestResult({
        success: response.ok,
        data: response.ok ? data : undefined,
        error: !response.ok ? (typeof data === 'object' ? data.error : data) || 'Request failed' : undefined,
        status: response.status,
        duration,
        headers: responseHeaders
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

  const clearResult = () => setTestResult(null);

  return {
    makeRequest,
    isLoading,
    testResult,
    clearResult,
    hasApiKey: !!apiKey
  };
}
