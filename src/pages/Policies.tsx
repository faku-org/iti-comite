import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDocuments } from "../hooks/useDocuments";
import DocumentCard from "../components/ui/DocumentCard";

export default function Policies() {
  const { t } = useTranslation();
  const { documents, loading, error } = useDocuments();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [...new Set(documents.map((d) => d.category))].sort();

  const filtered = documents
    .filter((d) => !activeCategory || d.category === activeCategory)
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return (
    <div className="page-enter min-h-screen bg-navy pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-frost/50" />
            <span className="text-xs font-semibold tracking-widest uppercase text-frost/60">
              {t("policies.sectionLabel")}
            </span>
          </div>

          <h1
            className="text-white font-sans leading-tight"
            style={{
              fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
            }}
          >
            {t("policies.pageTitle")}
          </h1>
          <p className="text-white/45 mt-3 text-base">
            {t("policies.pageSubtitle")}
          </p>
        </div>

        {/* Category filters */}
        {!loading && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wide border transition-all duration-150 ${
                activeCategory === null
                  ? "bg-mid border-mid text-white"
                  : "border-white/15 text-white/50 hover:border-white/30 hover:text-white/70"
              }`}
            >
              {t("policies.filterAll")}
            </button>

            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wide border transition-all duration-150 ${
                  activeCategory === cat
                    ? "bg-mid border-mid text-white"
                    : "border-white/15 text-white/50 hover:border-white/30 hover:text-white/70"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Document grid */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="glass-card h-44 animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="glass-card p-8 text-center">
            <p className="text-white/40 text-sm">{t("policies.error")}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="glass-card p-8 text-center">
            <p className="text-white/40 text-sm">{t("policies.noResults")}</p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((doc, i) => (
              <DocumentCard
                key={doc.slug}
                doc={doc}
                style={{ animationDelay: `${i * 60}ms` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
