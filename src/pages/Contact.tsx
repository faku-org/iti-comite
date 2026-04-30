import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { siteConfig } from "../config";

const icons: Record<string, ReactElement> = {
  Instagram: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  LinkedIn: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  GitHub: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  ),
};

export default function Contact() {
  const { t } = useTranslation();

  return (
    <div className="page-enter min-h-screen bg-navy pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-frost/50" />
            <span className="text-xs font-semibold tracking-widest uppercase text-frost/60">
              {t("contact.sectionLabel")}
            </span>
          </div>

          <h1
            className="text-white font-sans leading-tight mb-3"
            style={{
              fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
            }}
          >
            {t("contact.pageTitle")}
          </h1>
          <p className="text-white/45 text-base">{t("contact.pageSubtitle")}</p>
        </div>

        <div className="rule mb-12" />

        {/* Social links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {siteConfig.socials.map((social) => (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group glass-card flex items-center gap-5 px-7 py-6 hover:border-frost/25 transition-all duration-200"
            >
              <span className="text-mid group-hover:text-frost transition-colors">
                {icons[social.platform] ?? null}
              </span>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/35 mb-0.5">
                  {social.platform}
                </p>
                <p className="text-base font-semibold text-white group-hover:text-frost transition-colors truncate">
                  {social.label}
                </p>
              </div>

              <span className="text-white/20 group-hover:text-frost/50 transition-colors text-lg">
              </span>
            </a>
          ))}
        </div>

        <div className="rule mt-12 mb-12" />

        {/* Callout */}
        <div className="glass-card p-8">
          <p className="text-white/60 text-sm leading-relaxed max-w-lg">
            {t("contact.subtitle")}
          </p>
        </div>
      </div>
    </div>
  );
}
