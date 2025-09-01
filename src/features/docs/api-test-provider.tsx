"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { Application, ApiKey } from "@/lib/prisma-types";

interface ApiTestContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  applications: (Application & { apiKeys: ApiKey[] })[];
}

const ApiTestContext = createContext<ApiTestContextType | null>(null);

interface ApiTestProviderProps {
  applications: (Application & { apiKeys: ApiKey[] })[];
  children: ReactNode;
}

export function ApiTestProvider({ applications, children }: ApiTestProviderProps) {
  const [apiKey, setApiKey] = useState<string>("");

  const value: ApiTestContextType = {
    apiKey,
    setApiKey,
    applications,
  };

  return (
    <ApiTestContext.Provider value={value}>
      {children}
    </ApiTestContext.Provider>
  );
}

export function useApiTest() {
  const context = useContext(ApiTestContext);
  if (!context) {
    throw new Error("useApiTest must be used within ApiTestProvider");
  }
  return context;
}
