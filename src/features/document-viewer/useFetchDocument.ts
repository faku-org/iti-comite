import { useState, useEffect, useRef } from "react";

interface FetchDocumentResult {
  markdown: string | null;
  loading: boolean;
  error: Error | null;
}

export function useFetchDocument(githubRawUrl: string): FetchDocumentResult {
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const cacheRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    if (!githubRawUrl) return;

    const cached = cacheRef.current.get(githubRawUrl);
    if (cached !== undefined) {
      setMarkdown(cached);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setMarkdown(null);

    fetch(githubRawUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res.text();
      })
      .then((text) => {
        if (cancelled) return;
        cacheRef.current.set(githubRawUrl, text);
        setMarkdown(text);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e : new Error(String(e)));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [githubRawUrl]);

  return { markdown, loading, error };
}
