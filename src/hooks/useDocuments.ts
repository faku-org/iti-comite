import { useState, useEffect } from "react";
import type { DocumentMeta } from "../types";

export function useDocuments() {
  const [documents, setDocuments] = useState<DocumentMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/docs/index.json")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch index");
        return r.json() as Promise<DocumentMeta[]>;
      })
      .then(setDocuments)
      .catch(() => setError("error"))
      .finally(() => setLoading(false));
  }, []);

  return { documents, loading, error };
}

export function useDocument(slug: string) {
  const [content, setContent] = useState<string | null>(null);
  const [meta, setMeta] = useState<DocumentMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/docs/index.json").then((r) => r.json() as Promise<DocumentMeta[]>),
      fetch(`/docs/${slug}.md`).then((r) => {
        if (!r.ok) throw new Error("Document not found");
        return r.text();
      }),
    ])
      .then(([docs, rawContent]) => {
        const docMeta = docs.find((d) => d.slug === slug);
        if (!docMeta) throw new Error("Document not found");
        setMeta(docMeta);
        const stripped = rawContent.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
        setContent(stripped);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  return { content, meta, loading, error };
}
