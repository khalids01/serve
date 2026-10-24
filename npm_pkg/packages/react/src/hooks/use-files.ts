"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFileServer } from "../context/file-server-provider";
import type { FileAsset, Pagination } from "../contracts";
import type { ListInput } from "../lib/client";
export function useFiles(input: ListInput = {}) {
  const { client } = useFileServer();
  const key = JSON.stringify(input);
  const [data, setData] = useState<FileAsset[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();
  const [revision, setRevision] = useState(0);
  const refetch = useCallback(() => setRevision((value) => value + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(undefined);
    client
      .list(JSON.parse(key) as ListInput, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) {
          setData(result.data);
          setPagination(result.pagination);
        }
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted)
          setError(
            cause instanceof Error ? cause : new Error("Unable to load files."),
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [client, key, revision]);
  return { data, pagination, loading, error, refetch };
}
export function useDeleteFile() {
  const { client } = useFileServer();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<Error>();
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const remove = useCallback(
    async (id: string) => {
      setPending(true);
      setError(undefined);
      try {
        return await client.remove(id);
      } catch (cause) {
        const error =
          cause instanceof Error ? cause : new Error("Delete failed.");
        if (mounted.current) setError(error);
        throw error;
      } finally {
        if (mounted.current) setPending(false);
      }
    },
    [client],
  );
  return { remove, pending, error };
}
