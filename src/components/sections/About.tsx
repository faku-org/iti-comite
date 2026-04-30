import { useTranslation } from "react-i18next";
import { useInView } from "../../hooks/useInView";
import { siteConfig } from "../../config";

export default function About() {
  const { t, i18n } = useTranslation();
  const { ref, inView } = useInView<HTMLDivElement>();

  const bio =
    siteConfig.candidate.bio[
      i18n.language as keyof typeof siteConfig.candidate.bio
    ] ?? siteConfig.candidate.bio.es;

  return (
    <section className="bg-cobalt py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-16">
          <div className="h-px w-8 bg-frost/50" />
          <span className="text-xs font-semibold tracking-widest uppercase text-frost/60">
            {t("about.sectionLabel")}
          </span>
        </div>

        <div
          ref={ref}
          className={`grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center reveal ${inView ? "visible" : ""}`}
        >
          {/* Text column */}
          <div>
            <h2
              className="text-white font-sans leading-tight mb-6"
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              {t("about.title")}
            </h2>

            <p className="text-white/65 leading-relaxed text-base mb-8">
              {bio}
            </p>

            <div className="rule max-w-xs" />
          </div>

          {/* Photo column */}
          <div className="flex justify-center md:justify-end">
            <div
              className="relative bg-navy border border-frost/10 overflow-hidden"
              style={{ aspectRatio: "3/4", width: "100%", maxWidth: "320px" }}
            >
              <img
                src={siteConfig.candidate.avatarPath}
                alt={t("about.photoAlt")}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              {/* Placeholder overlay when no image */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span
                  className="text-frost/15 font-bold select-none"
                  style={{ fontSize: "6rem", fontWeight: 800 }}
                >
                  FP
                </span>
              </div>
              {/* Corner accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-mid" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
