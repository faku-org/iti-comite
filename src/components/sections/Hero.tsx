import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { siteConfig } from "../../config";

export default function Hero() {
  const { t, i18n } = useTranslation();
  const tagline =
    siteConfig.candidate.tagline[
      i18n.language as keyof typeof siteConfig.candidate.tagline
    ] ?? siteConfig.candidate.tagline.es;

  return (
    <section className="grain-overlay relative min-h-screen bg-navy flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Background gradient accent */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-100 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(73,136,196,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Horizontal decorative lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-frost/10" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-frost/10" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl w-full text-center">
        {/* Label with ruled lines */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-12 bg-frost/40" />
          <span className="text-xs font-semibold tracking-widest uppercase text-frost/60">
            {t("hero.candidateLabel")}
          </span>
          <div className="h-px w-12 bg-frost/40" />
        </div>

        {/* Candidate name — the typographic anchor */}
        <h1
          className="font-sans text-white leading-none tracking-tight mb-6 select-none"
          style={{
            fontSize: "clamp(3.5rem, 10vw, 8rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
          }}
        >
          {siteConfig.candidate.name}
        </h1>

        {/* Thin divider */}
        <div className="rule max-w-xs mx-auto mb-8" />

        {/* Tagline */}
        <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed mb-12 max-w-xl mx-auto">
          {tagline}
        </p>

        {/* CTA */}
        <Link
          to="/politicas"
          className="inline-flex items-center gap-3 bg-mid hover:bg-mid/85 text-white font-semibold text-sm tracking-wide px-9 py-4 transition-colors duration-200"
        >
          {t("hero.cta")}
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <div className="w-px h-10 bg-frost animate-bounce" />
      </div>
    </section>
  );
}
