export type DocumentNodeType =
  | "heading"
  | "paragraph"
  | "image"
  | "list"
  | "code"
  | "divider"
  | "reference-list";

export interface DocumentNode {
  id: string;
  type: DocumentNodeType;
  content: string;
  level?: 1 | 2 | 3 | 4;
  keepWithNext?: boolean;
  meta?: Record<string, unknown>;
}

export interface Page {
  id: string;
  number: number;
  nodes: DocumentNode[];
}

export interface ReferenceEntry {
  number: number;
  label: string;
  url: string;
}
