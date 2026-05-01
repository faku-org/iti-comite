import { unified } from "unified";
import remarkParse from "remark-parse";
import { nanoid } from "nanoid";
import type { Root, RootContent, PhrasingContent } from "mdast";
import type { DocumentNode } from "./types";

function serializeInline(nodes: PhrasingContent[]): string {
  return nodes
    .map((node) => {
      switch (node.type) {
        case "text":
          return escapeHtml(node.value);
        case "strong":
          return `<strong>${serializeInline(node.children)}</strong>`;
        case "emphasis":
          return `<em>${serializeInline(node.children)}</em>`;
        case "inlineCode":
          return `<code>${escapeHtml(node.value)}</code>`;
        case "link": {
          const label = serializeInline(node.children);
          const href = node.url;
          return `<a href="${escapeAttr(href)}">${label}</a>`;
        }
        case "image":
          return `<img src="${escapeAttr(node.url)}" alt="${escapeAttr(node.alt ?? "")}" />`;
        case "break":
          return "<br />";
        case "delete":
          return `<del>${serializeInline(node.children)}</del>`;
        default:
          return "";
      }
    })
    .join("");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(s: string): string {
  return s.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function serializeListItems(
  node: Extract<RootContent, { type: "list" }>,
  depth = 0,
): string {
  const tag = node.ordered ? "ol" : "ul";
  const items = node.children
    .map((li) => {
      const parts: string[] = [];
      for (const child of li.children) {
        if (child.type === "paragraph") {
          parts.push(serializeInline(child.children));
        } else if (child.type === "list") {
          parts.push(serializeListItems(child, depth + 1));
        }
      }
      return `<li>${parts.join("")}</li>`;
    })
    .join("");
  return `<${tag}>${items}</${tag}>`;
}

export function parseMarkdown(markdown: string): DocumentNode[] {
  const tree = unified().use(remarkParse).parse(markdown) as Root;
  const nodes: DocumentNode[] = [];

  for (const child of tree.children) {
    switch (child.type) {
      case "heading": {
        const rawLevel = child.depth;
        const level = (rawLevel > 4 ? 4 : rawLevel) as 1 | 2 | 3 | 4;
        nodes.push({
          id: nanoid(),
          type: "heading",
          content: serializeInline(child.children),
          level,
          keepWithNext: true,
        });
        break;
      }

      case "paragraph": {
        // A paragraph containing only an image becomes an image node
        if (
          child.children.length === 1 &&
          child.children[0].type === "image"
        ) {
          const img = child.children[0];
          nodes.push({
            id: nanoid(),
            type: "image",
            content: "",
            meta: {
              src: img.url,
              alt: img.alt ?? "",
              title: img.title ?? null,
            },
          });
        } else {
          nodes.push({
            id: nanoid(),
            type: "paragraph",
            content: serializeInline(child.children),
          });
        }
        break;
      }

      case "list": {
        nodes.push({
          id: nanoid(),
          type: "list",
          content: serializeListItems(child),
        });
        break;
      }

      case "code": {
        nodes.push({
          id: nanoid(),
          type: "code",
          content: child.value,
          meta: {
            lang: child.lang ?? null,
          },
        });
        break;
      }

      case "thematicBreak": {
        nodes.push({
          id: nanoid(),
          type: "divider",
          content: "",
        });
        break;
      }

      case "blockquote": {
        // Treat blockquotes as styled paragraphs
        const inner = child.children
          .flatMap((c) =>
            c.type === "paragraph" ? [serializeInline(c.children)] : [],
          )
          .join(" ");
        nodes.push({
          id: nanoid(),
          type: "paragraph",
          content: `<blockquote>${inner}</blockquote>`,
        });
        break;
      }

      default:
        break;
    }
  }

  // Always append reference-list as final node
  nodes.push({
    id: nanoid(),
    type: "reference-list",
    content: "",
  });

  return nodes;
}
