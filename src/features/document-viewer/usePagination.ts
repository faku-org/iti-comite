import { useState, useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import { CONTENT_WIDTH, CONTENT_HEIGHT } from "./constants";
import type { DocumentNode, Page } from "./types";

// ── HTML serialization for measurement ─────────────────────────────────────

function escHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function nodeToMeasureHtml(node: DocumentNode): string {
  switch (node.type) {
    case "heading":
      return `<div class="dv-measure-h${node.level ?? 1}">${node.content}</div>`;
    case "paragraph":
      return `<div class="dv-measure-p">${node.content}</div>`;
    case "list":
      return `<div class="dv-measure-list">${node.content}</div>`;
    case "code":
      return `<pre class="dv-measure-pre"><code>${escHtml(node.content)}</code></pre>`;
    case "divider":
      return `<hr class="dv-measure-hr" />`;
    case "image":
      // Images: use a placeholder height; actual image dimensions unknown until load
      return `<div style="height:180px;width:100%;background:#eee;"></div>`;
    case "reference-list":
      // Measured at a fixed conservative estimate (actual height depends on register calls)
      return `<div style="height:120px"></div>`;
    default:
      return "";
  }
}

// ── Measurement container ───────────────────────────────────────────────────

function createMeasureContainer(): HTMLDivElement {
  const div = document.createElement("div");
  div.style.cssText = [
    "position:absolute",
    "top:-9999px",
    "left:-9999px",
    "visibility:hidden",
    "pointer-events:none",
    `width:${CONTENT_WIDTH}px`,
    "font-family:'DM Sans',ui-sans-serif,system-ui,sans-serif",
    "font-size:11pt",
    "line-height:1.65",
    "color:#1a1a2e",
    "overflow:hidden",
  ].join(";");
  document.body.appendChild(div);
  return div;
}

function measureNode(container: HTMLDivElement, node: DocumentNode): number {
  container.innerHTML = nodeToMeasureHtml(node);
  return container.getBoundingClientRect().height;
}

// ── Bisection: split oversized node content ─────────────────────────────────

function bisectContent(
  container: HTMLDivElement,
  node: DocumentNode,
): [DocumentNode, DocumentNode] {
  const text = node.content;
  let lo = 0;
  let hi = text.length;

  while (hi - lo > 4) {
    const mid = Math.floor((lo + hi) / 2);
    const probe: DocumentNode = { ...node, id: nanoid(), content: text.slice(0, mid) };
    const h = measureNode(container, probe);
    if (h <= CONTENT_HEIGHT) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  // Snap to word boundary
  let cut = lo;
  const spaceIdx = text.lastIndexOf(" ", cut);
  if (spaceIdx > cut / 2) cut = spaceIdx + 1;

  const head: DocumentNode = { ...node, id: nanoid(), content: text.slice(0, cut).trimEnd() };
  const tail: DocumentNode = { ...node, id: nanoid(), content: text.slice(cut).trimStart() };
  return [head, tail];
}

// ── Core packing algorithm ──────────────────────────────────────────────────

function paginate(nodes: DocumentNode[]): Page[] {
  const container = createMeasureContainer();

  try {
    const pages: Page[] = [];
    let currentPageNodes: DocumentNode[] = [];
    let remaining = CONTENT_HEIGHT;

    function flushPage() {
      if (currentPageNodes.length > 0) {
        pages.push({
          id: nanoid(),
          number: pages.length + 1,
          nodes: currentPageNodes,
        });
      }
      currentPageNodes = [];
      remaining = CONTENT_HEIGHT;
    }

    // Expand any node that exceeds CONTENT_HEIGHT by bisection
    const expanded: DocumentNode[] = [];
    for (const node of nodes) {
      const h = measureNode(container, node);
      if (h > CONTENT_HEIGHT && node.content.length > 0) {
        let tail: DocumentNode = node;
        while (true) {
          const th = measureNode(container, tail);
          if (th <= CONTENT_HEIGHT) {
            expanded.push(tail);
            break;
          }
          const [head, rest] = bisectContent(container, tail);
          expanded.push(head);
          tail = rest;
        }
      } else {
        expanded.push(node);
      }
    }

    for (let i = 0; i < expanded.length; i++) {
      const node = expanded[i];
      const h = measureNode(container, node);

      if (h <= remaining) {
        // Orphan heading check: heading fits but its sibling won't
        if (node.keepWithNext && i + 1 < expanded.length) {
          const sibling = expanded[i + 1];
          const siblingH = measureNode(container, sibling);
          if (h <= remaining && siblingH > remaining - h) {
            // Push heading to next page
            flushPage();
          }
        }
        currentPageNodes.push(node);
        remaining -= h;
      } else {
        flushPage();
        currentPageNodes.push(node);
        remaining -= h;
      }
    }

    if (currentPageNodes.length > 0) flushPage();

    return pages;
  } finally {
    document.body.removeChild(container);
  }
}

// ── Hook ────────────────────────────────────────────────────────────────────

export function usePagination(nodes: DocumentNode[]): Page[] {
  const [pages, setPages] = useState<Page[]>([]);
  const nodesRef = useRef<DocumentNode[]>([]);

  useEffect(() => {
    if (nodes === nodesRef.current) return;
    nodesRef.current = nodes;

    if (nodes.length === 0) {
      setPages([]);
      return;
    }

    const result = paginate(nodes);
    setPages(result);
  }, [nodes]);

  return pages;
}
