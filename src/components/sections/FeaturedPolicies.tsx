import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useInView } from "../../hooks/useInView";
import { useDocuments } from "../../hooks/useDocuments";
import { siteConfig } from "../../config";
import DocumentCard from "../ui/DocumentCard";

export default function FeaturedPolicies() {
  const { t } = useTranslation();
  const { ref, inView } = useInView<HTMLDivElement>();
  const { documents, loading } = useDocuments();

  const pinned = siteConfig.pinnedDocuments as readonly string[];
  const featured = documents
    .filter((d) => pinned.includes(d.slug))
    .sort((a, b) => pinned.indexOf(a.slug) - pinned.indexOf(b.slug));

  return (
    <section className="bg-navy py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-16">
          <div className="h-px w-8 bg-frost/50" />
          <span className="text-xs font-semibold tracking-widest uppercase text-frost/60">
            {t("policies.sectionLabel")}
          </span>
        </div>

        <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
          <h2
            className="text-white font-sans leading-tight"
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
            }}
          >
            {t("policies.featuredTitle")}
          </h2>

          <Link
            to="/politicas"
            className="text-sm font-semibold text-frost/70 hover:text-frost transition-colors shrink-0"
          >
            {t("policies.pageTitle")} &rarr;
          </Link>
        </div>

        <div
          ref={ref}
          className={`reveal ${inView ? "visible" : ""}`}
        >
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="glass-card h-44 animate-pulse"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map((doc, i) => (
                <DocumentCard
                  key={doc.slug}
                  doc={doc}
                  style={{ animationDelay: `${i * 80}ms` }}
                />
              ))}
            </div>
          ) : (
            <div className="glass-card p-8 text-center">
              <p className="text-white/40 text-sm">
                {t("policies.noResults")}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
