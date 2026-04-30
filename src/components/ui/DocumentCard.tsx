import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Badge from "./Badge";
import type { DocumentMeta } from "../../types";

interface DocumentCardProps {
  doc: DocumentMeta;
  style?: React.CSSProperties;
}

function formatDate(dateStr: string, lang: string): string {
  return new Date(dateStr).toLocaleDateString(lang === "es" ? "es-UY" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function DocumentCard({ doc, style }: DocumentCardProps) {
  const { t, i18n } = useTranslation();

  return (
    <Link
      to={`/politicas/${doc.slug}`}
      className="group block glass-card p-6 hover:border-frost/25 transition-all duration-200 reveal visible"
      style={style}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <Badge label={doc.category} />
        {doc.pinned && <Badge label={t("policies.pinned")} variant="pinned" />}
      </div>

      <h3 className="text-base font-semibold text-white mb-2 leading-snug group-hover:text-frost transition-colors">
        {doc.title}
      </h3>

      {doc.excerpt && (
        <p className="text-sm text-white/50 leading-relaxed mb-4 line-clamp-2">
          {doc.excerpt}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto">
        <span className="text-xs text-white/35">
          {formatDate(doc.date, i18n.language)}
        </span>
        <span className="text-xs font-semibold text-mid group-hover:text-frost transition-colors">
          {t("policies.readMore")} &rarr;
        </span>
      </div>
    </Link>
  );
}
