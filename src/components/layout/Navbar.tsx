import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";

const navLinks = (t: (k: string) => string) => [
  { to: "/", label: t("nav.home") },
  { to: "/politicas", label: t("nav.policies") },
  { to: "/contacto", label: t("nav.contact") },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const toggleLang = () => {
    const next = i18n.language === "es" ? "en" : "es";
    i18n.changeLanguage(next);
    localStorage.setItem("i18n-lang", next);
  };

  const links = navLinks(t);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-md bg-navy/90 border-b border-white/10 shadow-lg"
            : ""
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-frost font-bold text-lg tracking-tight select-none"
          >
            <img
              src="/assets/logo.svg"
              alt="FP"
              className="h-8 w-auto"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = "block";
              }}
            />
            <span className="hidden text-frost font-bold text-lg" aria-hidden="true">
              FP
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative text-sm font-medium transition-colors pb-0.5 ${
                  isActive(link.to)
                    ? "text-frost"
                    : "text-white/65 hover:text-white"
                }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-frost" />
                )}
              </Link>
            ))}
          </div>

          {/* Right: language switcher + hamburger */}
          <div className="flex items-center gap-5">
            <button
              onClick={toggleLang}
              className="text-xs font-semibold tracking-widest text-white/50 hover:text-frost uppercase transition-colors"
              aria-label="Toggle language"
            >
              {i18n.language === "es" ? "ES" : "EN"}
              <span className="text-white/25 mx-1">/</span>
              {i18n.language === "es" ? "EN" : "ES"}
            </button>

            <button
              className="md:hidden flex flex-col gap-1.5 p-1"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span
                className={`block w-5 h-0.5 bg-white transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`block w-5 h-0.5 bg-white transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block w-5 h-0.5 bg-white transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-navy/98 backdrop-blur-sm flex flex-col items-center justify-center gap-10 transition-all duration-300 md:hidden ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`text-3xl font-bold tracking-tight transition-colors ${
              isActive(link.to) ? "text-frost" : "text-white/80 hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </>
  );
}
