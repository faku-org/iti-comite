import { useMemo, useEffect } from "react";
import { Printer, ArrowLeft } from "lucide-react";
import { useFetchDocument } from "./useFetchDocument";
import { parseMarkdown } from "./parseMarkdown";
import { usePagination } from "./usePagination";
import { PageRenderer } from "./PageRenderer";
import { useReferenceStore } from "./ReferenceStore";

interface DocumentViewerProps {
  githubRawUrl: string;
}

export function DocumentViewer({ githubRawUrl }: DocumentViewerProps) {
  const { markdown, loading, error } = useFetchDocument(githubRawUrl);
  const reset = useReferenceStore((s) => s.reset);

  const nodes = useMemo(() => {
    if (!markdown) return [];
    reset();
    return parseMarkdown(markdown);
  }, [markdown, reset]);

  const pages = usePagination(nodes);

  // Reset references when the URL changes
  useEffect(() => {
    reset();
  }, [githubRawUrl, reset]);

  const documentTitle = useMemo(() => {
    if (!markdown) return "";
    const match = markdown.match(/^#\s+(.+)/m);
    return match ? match[1].trim() : "Documento";
  }, [markdown]);

  return (
    <div style={{ minHeight: "100vh", background: "#1a1a2e" }}>
      {/* Top bar — hidden in print */}
      <div
        className="dv-topbar no-print"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          height: 56,
          background: "rgba(15,40,84,0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(189,232,245,0.1)",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => window.history.back()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "rgba(255,255,255,0.45)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              padding: "4px 8px",
              borderRadius: 4,
            }}
          >
            <ArrowLeft size={14} />
            Volver
          </button>
          <span
            style={{
              color: "rgba(255,255,255,0.15)",
              fontSize: 14,
              userSelect: "none",
            }}
          >
            /
          </span>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: "rgba(255,255,255,0.8)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "40vw",
            }}
          >
            {documentTitle}
          </span>
        </div>

        <button
          onClick={() => window.print()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            padding: "6px 14px",
            borderRadius: 6,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "transparent",
            color: "rgba(255,255,255,0.65)",
            cursor: "pointer",
            transition: "all 0.15s",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <Printer size={14} />
          Imprimir / Exportar PDF
        </button>
      </div>

      {/* States */}
      {loading && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            color: "rgba(255,255,255,0.35)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
          }}
        >
          Cargando documento…
        </div>
      )}

      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            color: "rgba(255,255,255,0.35)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
          }}
        >
          Error al cargar: {error.message}
        </div>
      )}

      {!loading && !error && pages.length === 0 && nodes.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            color: "rgba(255,255,255,0.35)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
          }}
        >
          Calculando páginas…
        </div>
      )}

      {pages.length > 0 && (
        <PageRenderer pages={pages} documentTitle={documentTitle} />
      )}
    </div>
  );
}
