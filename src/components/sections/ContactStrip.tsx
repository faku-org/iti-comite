import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { useInView } from "../../hooks/useInView";
import { siteConfig } from "../../config";

const icons: Record<string, ReactElement> = {
  Instagram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  LinkedIn: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  GitHub: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  ),
  Mail: <Mail size={18} aria-hidden="true" />,
};

export default function ContactStrip() {
  const { t } = useTranslation();
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section className="bg-cobalt py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <div className="h-px w-8 bg-frost/50" />
          <span className="text-xs font-semibold tracking-widest uppercase text-frost/60">
            {t("contact.sectionLabel")}
          </span>
        </div>

        <div
          ref={ref}
          className={`flex flex-col md:flex-row items-start md:items-end justify-between gap-8 reveal ${inView ? "visible" : ""}`}
        >
          <div>
            <h2
              className="text-white font-sans mb-2"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)", fontWeight: 800, letterSpacing: "-0.03em" }}
            >
              {t("contact.title")}
            </h2>
            <p className="text-white/50 text-sm max-w-sm leading-relaxed">
              {t("contact.subtitle")}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {siteConfig.socials.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 glass-card px-5 py-3 text-sm font-medium text-white/75 hover:text-frost hover:border-frost/25 transition-all duration-200"
              >
                {icons[social.platform] ?? null}
                <span>{social.label}</span>
              </a>
            ))}

            <Link
              to="/contacto"
              className="inline-flex items-center gap-2.5 border border-mid/40 text-mid hover:bg-mid/10 px-5 py-3 text-sm font-medium transition-all duration-200"
            >
              {t("nav.contact")} &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
