import { create } from "zustand";
import type { ReferenceEntry } from "./types";

interface ReferenceStore {
  references: ReferenceEntry[];
  register: (label: string, url: string) => number;
  reset: () => void;
}

export const useReferenceStore = create<ReferenceStore>((set, get) => ({
  references: [],

  register(label: string, url: string): number {
    const existing = get().references.find((r) => r.url === url);
    if (existing) return existing.number;
    const number = get().references.length + 1;
    set((state) => ({
      references: [...state.references, { number, label, url }],
    }));
    return number;
  },

  reset() {
    set({ references: [] });
  },
}));
