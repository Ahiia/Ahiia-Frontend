import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { scrollToSection } from "../../utils/scrollToSection";
import { useScrollSpy } from "../../hooks/useScrollSpy";
import logo from "../../assets/ahiia_icon.svg";
import { NAV_LINKS } from "./navigation";

const Logo = () => (
  <a href="/" className="flex items-center gap-2 shrink-0">
    <img src={logo} alt="Logo" className="h-6 w-6" />
    <span className="text-white font-semibold text-lg tracking-tight">
      Ahiia.AI
    </span>
  </a>
);

const Header = () => {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Which section is currently in view drives the default active state...
  const spyActiveId = useScrollSpy(NAV_LINKS.map((l) => l.id));
  // ...but a click sets it immediately, so the highlight doesn't lag
  // behind while the smooth scroll animation is still in flight.
  const [clickedId, setClickedId] = useState(null);
  const activeId = NAV_LINKS.find((link) => link.href === pathname)?.id ?? clickedId ?? spyActiveId;

  // Solidify the header once the page scrolls, keep it transparent at the very top
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);
// Once the user clicks a link, stop forcing that id and hand control
  // back to the scroll spy after the scroll animation has settled.
  useEffect(() => {
    if (clickedId === null) return;
    const timer = setTimeout(() => setClickedId(null), 900);
    return () => clearTimeout(timer);
  }, [clickedId]);

  const handleNavClick = (id) => (e) => {
    if (window.location.pathname !== "/") return;
    e.preventDefault();
    setClickedId(id);
    scrollToSection(id);
    setMobileOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-[#0B0B24]/80 backdrop-blur-md border-b border-white/10"
          : "bg-[#07071c] border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-[72px] items-center justify-between">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-1.5 py-1.5">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href || `/#${link.id}`}
                onClick={link.href ? undefined : handleNavClick(link.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                  activeId === link.id
                    ? "bg-white/10 text-white"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="/signup"
              className="px-4 py-2 text-sm font-medium text-white rounded-full border border-white/15 hover:bg-white/5 transition-colors duration-200"
            >
              Get Started
            </a>
            <a
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-white rounded-full bg-indigo-500 hover:bg-indigo-400 transition-colors duration-200"
            >
              Log In
            </a>
          </div>

          {/* Mobile quick CTA + toggle */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href="/signup"
              className="px-3.5 py-1.5 text-xs font-semibold text-white rounded-full bg-indigo-500/90 hover:bg-indigo-400 shadow-[0_0_16px_rgba(99,102,241,0.4)] transition-all active:scale-95"
            >
              Get Started
            </a>
            <button
              type="button"
              className="text-white p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 sm:px-6 pb-6 pt-3 flex flex-col gap-1.5 bg-[#0B0B24]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href || `/#${link.id}`}
              onClick={link.href ? () => setMobileOpen(false) : handleNavClick(link.id)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeId === link.id
                  ? "bg-indigo-500/20 text-white border border-indigo-400/30 shadow-xs"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{link.label}</span>
              <span className="text-xs text-indigo-400/70">→</span>
            </a>
          ))}
          <div className="grid grid-cols-2 gap-2.5 mt-4 pt-3 border-t border-white/10">
            <a
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 text-center text-sm font-semibold text-white rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all"
            >
              Log In
            </a>
            <a
              href="/signup"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 text-center text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 shadow-[0_8px_20px_-6px_rgba(99,102,241,0.6)] active:scale-[0.98] transition-all"
            >
              Sign Up Free
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
