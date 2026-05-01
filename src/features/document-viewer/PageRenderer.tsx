import type { ReactNode } from "react";
import { PAGE_CONFIG } from "./constants";
import { InlineLink } from "./InlineLink";
import { ReferenceList } from "./ReferenceList";
import type { DocumentNode, Page } from "./types";

// ── Inline HTML → React (handles <a> → InlineLink) ─────────────────────────

interface Token {
  type: "text" | "link" | "tag";
  text?: string;
  href?: string;
  label?: string;
  tag?: string;
}

function tokenizeHtml(html: string): Token[] {
  const tokens: Token[] = [];
  // Match <a href="...">, </a>, or plain text
  const re = /<a\s+href="([^"]*)"[^>]*>([\s\S]*?)<\/a>|<([^>]+)>|([^<]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    if (m[1] !== undefined) {
      // <a href="url">label</a>
      tokens.push({ type: "link", href: m[1], label: m[2] });
    } else if (m[3] !== undefined) {
      // other tag — pass as raw HTML via a span
      tokens.push({ type: "tag", tag: m[0] });
    } else if (m[4] !== undefined) {
      tokens.push({ type: "text", text: m[4] });
    }
  }
  return tokens;
}

function renderHtml(html: string): ReactNode {
  const tokens = tokenizeHtml(html);
  return tokens.map((token, i) => {
    if (token.type === "link" && token.href && token.label !== undefined) {
      const plainLabel = token.label.replace(/<[^>]+>/g, "");
      return <InlineLink key={i} label={plainLabel} url={token.href} />;
    }
    if (token.type === "tag" && token.tag) {
      return (
        <span
          key={i}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: serialized from our own AST
          dangerouslySetInnerHTML={{ __html: token.tag }}
        />
      );
    }
    return <span key={i}>{token.text}</span>;
  });
}

// ── Node renderer ───────────────────────────────────────────────────────────

function NodeView({ node }: { node: DocumentNode }) {
  switch (node.type) {
    case "heading": {
      const Tag = (`h${node.level ?? 1}`) as "h1" | "h2" | "h3" | "h4";
      return <Tag className={`dv-h${node.level ?? 1}`}>{renderHtml(node.content)}</Tag>;
    }

    case "paragraph":
      if (node.content.startsWith("<blockquote>")) {
        return (
          <blockquote className="dv-blockquote">
            {renderHtml(node.content.replace(/^<blockquote>|<\/blockquote>$/g, ""))}
          </blockquote>
        );
      }
      return <p className="dv-p">{renderHtml(node.content)}</p>;

    case "list":
      return (
        <div
          className="dv-list"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: serialized from our own AST
          dangerouslySetInnerHTML={{ __html: node.content }}
        />
      );

    case "code":
      return (
        <pre className="dv-pre">
          <code className={node.meta?.lang ? `language-${node.meta.lang}` : ""}>
            {node.content}
          </code>
        </pre>
      );

    case "divider":
      return <hr className="dv-hr" />;

    case "image":
      return (
        <div className="dv-image">
          <img
            src={node.meta?.src as string}
            alt={(node.meta?.alt as string) ?? ""}
            style={{ maxWidth: "100%", height: "auto", display: "block" }}
          />
        </div>
      );

    case "reference-list":
      return <ReferenceList />;

    default:
      return null;
  }
}

// ── Page ────────────────────────────────────────────────────────────────────

interface PageViewProps {
  page: Page;
  totalPages: number;
  documentTitle: string;
  footer?: ReactNode;
}

function PageView({ page, totalPages, documentTitle, footer }: PageViewProps) {
  return (
    <div
      className="dv-page"
      style={{
        width: PAGE_CONFIG.widthPx,
        minHeight: PAGE_CONFIG.heightPx,
        background: "#ffffff",
        boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        pageBreakAfter: "always",
        breakAfter: "page",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: PAGE_CONFIG.marginLeftPx,
          right: PAGE_CONFIG.marginRightPx,
          height: PAGE_CONFIG.marginTopPx,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          paddingBottom: 12,
          borderBottom: "0.5px solid #BDE8F5",
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 8,
            fontWeight: 600,
            color: "#0F2854",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "60%",
          }}
        >
          {documentTitle}
        </span>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 8,
            color: "#4988C4",
          }}
        >
          Página {page.number} de {totalPages}
        </span>
      </div>

      {/* Content */}
      <div
        className="dv-content"
        style={{
          position: "absolute",
          top: PAGE_CONFIG.marginTopPx,
          bottom: PAGE_CONFIG.marginBottomPx,
          left: PAGE_CONFIG.marginLeftPx,
          right: PAGE_CONFIG.marginRightPx,
          overflow: "hidden",
        }}
      >
        {page.nodes.map((node) => (
          <NodeView key={node.id} node={node} />
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: PAGE_CONFIG.marginLeftPx,
          right: PAGE_CONFIG.marginRightPx,
          height: PAGE_CONFIG.marginBottomPx,
          display: "flex",
          alignItems: "flex-start",
          paddingTop: 12,
          borderTop: "0.5px solid #BDE8F5",
        }}
      >
        {footer ?? null}
      </div>
    </div>
  );
}

// ── PageRenderer (public) ───────────────────────────────────────────────────

interface PageRendererProps {
  pages: Page[];
  documentTitle: string;
  footer?: ReactNode;
}

export function PageRenderer({ pages, documentTitle, footer }: PageRendererProps) {
  if (pages.length === 0) return null;

  return (
    <div
      className="dv-viewer"
      style={{
        background: "#1a1a2e",
        padding: "32px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 32,
        minHeight: "100vh",
      }}
    >
      {pages.map((page) => (
        <PageView
          key={page.id}
          page={page}
          totalPages={pages.length}
          documentTitle={documentTitle}
          footer={footer}
        />
      ))}
    </div>
  );
}
