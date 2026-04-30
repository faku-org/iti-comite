import { useTranslation } from "react-i18next";
import { siteConfig } from "../../config";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/8 bg-navy py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <p className="text-sm font-semibold text-white/70">
            {siteConfig.candidate.name}
          </p>
          <p className="text-xs text-white/35 mt-0.5">
            {siteConfig.candidate.title}
          </p>
        </div>

        <div className="text-xs text-white/30 text-center">
          {year} &mdash; {t("footer.rights")}
        </div>

        <p className="text-xs text-white/30 italic">{t("footer.madeWith")}</p>
      </div>
    </footer>
  );
}
