"use client";
import { useCallback, useEffect, useState } from "react";
import { useFileServer } from "../context/file-server-provider";
import type { StorageLocation } from "../contracts";
export function useStorageLocations() {
  const { client } = useFileServer();
  const [data, setData] = useState<StorageLocation[]>([]),
    [defaultStorageLocationId, setDefault] = useState<string>(),
    [loading, setLoading] = useState(true),
    [error, setError] = useState<Error>(),
    [revision, setRevision] = useState(0);
  const refetch = useCallback(() => setRevision((value) => value + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(undefined);
    client
      .storageLocations(controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) {
          setData(result.data);
          setDefault(result.defaultStorageLocationId);
        }
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted)
          setError(
            cause instanceof Error
              ? cause
              : new Error("Unable to load destinations."),
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [client, revision]);
  return { data, defaultStorageLocationId, loading, error, refetch };
}
