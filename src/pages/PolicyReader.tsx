import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { Printer } from "lucide-react";
import { useDocument } from "../hooks/useDocuments";
import Badge from "../components/ui/Badge";

const mdComponents: Components = {
  h1: ({ children }) => <h1>{children}</h1>,
  h2: ({ children }) => <h2>{children}</h2>,
  h3: ({ children }) => <h3>{children}</h3>,
  h4: ({ children }) => <h4>{children}</h4>,
  p: ({ children }) => <p>{children}</p>,
  ul: ({ children }) => <ul>{children}</ul>,
  ol: ({ children }) => <ol>{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  code: ({ children, className }) => {
    const isBlock = className?.startsWith("language-");
    return isBlock ? (
      <pre><code className={className}>{children}</code></pre>
    ) : (
      <code>{children}</code>
    );
  },
  table: ({ children }) => (
    <div style={{ overflowX: "auto" }}>
      <table>{children}</table>
    </div>
  ),
  th: ({ children }) => <th>{children}</th>,
  td: ({ children }) => <td>{children}</td>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  strong: ({ children }) => <strong>{children}</strong>,
};

function formatDate(dateStr: string, lang: string): string {
  return new Date(dateStr).toLocaleDateString(
    lang === "es" ? "es-UY" : "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );
}

export default function PolicyReader() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const { content, meta, loading, error } = useDocument(slug ?? "");

  const headings = useMemo(() => {
    if (!content) return [];
    return content
      .split("\n")
      .filter((line) => /^#{1,3} /.test(line))
      .map((line) => {
        const match = line.match(/^(#{1,3}) (.+)/);
        if (!match) return null;
        return { level: match[1].length, text: match[2].trim() };
      })
      .filter((h): h is { level: number; text: string } => h !== null);
  }, [content]);

  return (
    <div className="page-enter min-h-screen bg-navy pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link
          to="/politicas"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-frost transition-colors mb-10 no-print"
        >
          <span>&larr;</span>
          {t("policies.backToList")}
        </Link>

        {loading && (
          <div className="space-y-4 animate-pulse">
            <div className="h-6 bg-cobalt/50 w-1/4" />
            <div className="h-12 bg-cobalt/50 w-3/4" />
            <div className="h-4 bg-cobalt/30 w-1/3" />
            <div className="h-px bg-cobalt/30" />
            <div className="space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-cobalt/20 rounded" />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="glass-card p-8 text-center">
            <p className="text-white/40">{t("policies.error")}</p>
          </div>
        )}

        {!loading && !error && meta && content && (
          <>
            {/* Running header - print only, position:fixed repeats on every page */}
            <div className="print-only print-running-header">
              <span>Facundo Presa — Candidato a Comité de Participación</span>
              <span className="print-running-header-title">{meta.title}</span>
            </div>

            {/* Running footer - print only */}
            <div className="print-only print-running-footer">
              <span className="print-footer-slogan">Construyendo futuro</span>
              <span>{formatDate(meta.date, i18n.language)}</span>
            </div>

            {/* Cover page - print only, occupies 2/3 of page 1 */}
            <div className="print-only print-cover">
              <div className="print-cover-category">{meta.category}</div>
              <h1 className="print-cover-title">{meta.title}</h1>
              <div className="print-cover-divider" />
              <div className="print-cover-meta">
                <div>
                  <div className="print-cover-author">Facundo Presa</div>
                  <div className="print-cover-role">Candidato a Comité de Participación</div>
                </div>
                <time className="print-cover-date">
                  {formatDate(meta.date, i18n.language)}
                </time>
              </div>
            </div>

            {/* Table of contents - print only, page 2 */}
            {headings.length > 0 && (
              <div className="print-only print-toc">
                <div className="print-toc-title">Índice</div>
                {headings.map((h, i) => (
                  <div key={i} className={`print-toc-entry level-${h.level}`}>
                    {h.text}
                  </div>
                ))}
              </div>
            )}

          <article>
            {/* Document header */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <Badge label={meta.category} />
                {meta.pinned && (
                  <Badge label={t("policies.pinned")} variant="pinned" />
                )}
              </div>

              <h1
                className="text-white font-sans leading-tight mb-4"
                style={{
                  fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                }}
              >
                {meta.title}
              </h1>

              <time className="text-sm text-white/35">
                {formatDate(meta.date, i18n.language)}
              </time>
            </div>

            <div className="rule mb-10" />

            {/* Document body */}
            <div className="prose-campaign">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={mdComponents}
              >
                {content}
              </ReactMarkdown>
            </div>

            <div className="rule mt-12 mb-8" />

            {/* Footer actions */}
            <div className="flex items-center justify-between flex-wrap gap-4 no-print">
              <Link
                to="/politicas"
                className="text-sm text-white/40 hover:text-frost transition-colors"
              >
                &larr; {t("policies.backToList")}
              </Link>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 text-sm px-3 py-1.5 border border-white/20 rounded text-white/50 hover:text-white hover:border-white/40 transition-colors cursor-pointer"
              >
                <Printer size={14} />
                Imprimir
              </button>
            </div>
          </article>
          </>
        )}
      </div>
    </div>
  );
}
