"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { Application, ApiKey } from "@/lib/prisma-types";

interface ApiTestContextType {
  selectedApp: string;
  selectedApiKey: string;
  setSelectedApp: (appId: string) => void;
  setSelectedApiKey: (keyHash: string) => void;
  applications: (Application & { apiKeys: ApiKey[] })[];
  getSelectedApplication: () => (Application & { apiKeys: ApiKey[] }) | undefined;
  getSelectedKey: () => ApiKey | undefined;
}

const ApiTestContext = createContext<ApiTestContextType | null>(null);

interface ApiTestProviderProps {
  applications: (Application & { apiKeys: ApiKey[] })[];
  children: ReactNode;
}

export function ApiTestProvider({ applications, children }: ApiTestProviderProps) {
  const [selectedApp, setSelectedApp] = useState<string>("");
  const [selectedApiKey, setSelectedApiKey] = useState<string>("");

  const getSelectedApplication = () => {
    return applications.find(app => app.id === selectedApp);
  };

  const getSelectedKey = () => {
    const app = getSelectedApplication();
    return app?.apiKeys.find(key => key.hash === selectedApiKey);
  };

  const handleSetSelectedApp = (appId: string) => {
    setSelectedApp(appId);
    setSelectedApiKey(""); // Reset API key when app changes
  };

  const value: ApiTestContextType = {
    selectedApp,
    selectedApiKey,
    setSelectedApp: handleSetSelectedApp,
    setSelectedApiKey,
    applications,
    getSelectedApplication,
    getSelectedKey,
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
