import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Check, Sparkles, Loader2 } from "lucide-react";
import FeaturesSection from "../components/FeaturesSection";
import AhiiaWorkspace from "../components/AhiiaWorkspace";
import DocumentLibrary from "../components/DocumentLibrary";
import AiQualitySection from "../components/AiQualitySection";
import WaitlistCta from "../components/WaitListCta";
import { scrollToSection } from "../../utils/scrollToSection";
import logo from "../../assets/ahiia_icon.svg";

const FIELDS = [
  { label: "Company", value: "Kanto Logistics Ltd." },
  { label: "Client", value: "Ridgepoint Retail Group" },
  { label: "Project", value: "Nationwide Fulfilment Rollout" },
  { label: "Scope", value: "4 warehouses \u00b7 12 months" },
  { label: "Budget", value: "\u20a648,500,000" },
  { label: "Timeline", value: "Q3 2026 - Q2 2027" },
];

const GEN_STEPS = [
  "Understanding your business",
  "Structuring your document",
  "Applying your brand",
  "Reviewing content",
];

// Entrance animation helper: fades/slides an element in once `show` flips true
const Reveal = ({ show, delay = 0, className = "", children }) => (
  <div
    className={`transition-all ease-out duration-700 ${
      show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
    } ${className}`}
    style={{ transitionDelay: `${delay}ms` }}
  >
    {children}
  </div>
);

const HeroMock = ({ show }) => (
  <Reveal show={show} delay={350} className="w-full max-w-4xl">
    <div className="relative rounded-2xl md:rounded-3xl border border-indigo-200/40 bg-white backdrop-blur-xl shadow-[0_25px_70px_-15px_rgba(79,70,229,0.45)] overflow-hidden">
      {/* card header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center gap-2 text-slate-900 text-xs sm:text-sm font-bold">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Sparkles size={14} />
          </span>
          Company memory
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold bg-emerald-50 border border-emerald-200/70 rounded-full px-2.5 py-1 text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Synced
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr_0.95fr] divide-y lg:divide-y-0 lg:divide-x divide-slate-100 text-left">
        {/* Column 1: document details */}
        <div className="p-4 sm:p-6 space-y-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Document type
            </p>
            <div className="flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50/70 px-3.5 py-2.5">
              <span className="text-xs sm:text-sm font-bold text-indigo-700">
                Business Proposal
              </span>
              <Sparkles size={14} className="text-indigo-500" />
            </div>
          </div>
          <dl className="grid grid-cols-2 sm:grid-cols-1 gap-2.5 sm:gap-0 sm:space-y-2.5">
            {FIELDS.map((f) => (
              <div
                key={f.label}
                className="flex flex-col sm:flex-row sm:items-start justify-between gap-0.5 sm:gap-3 text-xs bg-slate-50/70 sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none border border-slate-100 sm:border-0"
              >
                <dt className="text-slate-400 font-medium shrink-0">{f.label}</dt>
                <dd className="text-slate-900 font-bold sm:text-right truncate">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Column 2: generation progress */}
        <div className="p-4 sm:p-6 flex flex-col bg-slate-50/30 lg:bg-transparent">
          <div className="flex items-center gap-2 mb-3.5">
            <Loader2 size={15} className="text-indigo-600 animate-spin" />
            <p className="text-xs sm:text-sm font-bold text-slate-900">
              Generating your proposal&hellip;
            </p>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 sm:gap-3 flex-1">
            {GEN_STEPS.map((step) => (
              <li
                key={step}
                className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-600"
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shrink-0">
                  <Check size={11} strokeWidth={3} />
                </span>
                {step}
              </li>
            ))}
          </ul>
          <div className="mt-4 sm:mt-5">
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500" />
            </div>
            <p className="mt-2 text-[11px] font-medium text-slate-400">
              Draft ready in about 40 seconds
            </p>
          </div>
        </div>

        {/* Column 3: brand kit + result */}
        <div className="p-4 sm:p-6 space-y-3.5 sm:space-y-4">
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-2.5">
              <Sparkles size={13} className="text-indigo-600" />
              Brand Kit Applied
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-900 border border-slate-200 p-1 shadow-xs shrink-0">
                <img src={logo} alt="Ahiia Logo" className="h-4 w-4 object-contain" />
              </span>
              <span className="h-7 w-7 rounded-md bg-indigo-800 border border-white/10 shrink-0" />
              <span className="h-7 w-7 rounded-md bg-indigo-500 border border-white/10 shrink-0" />
              <span className="h-7 w-7 rounded-md bg-indigo-300 border border-white/10 shrink-0" />
              <span className="ml-1 text-[11px] font-medium text-slate-500 leading-tight">
                Montserrat &middot; Ahiia Logo
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 mb-1">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Check size={10} strokeWidth={3} />
              </span>
              Proposal Generated
            </div>
            <p className="text-xs text-emerald-800 font-bold mb-1">
              14 pages &middot; 8 sections
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your proposal has been generated using your company profile, brand
              guidelines, pricing, and sales rules. Review the content, make
              improvements, or export it when you&rsquo;re ready.
            </p>
          </div>
        </div>
      </div>
    </div>
  </Reveal>
);

const HeroDecoration = () => (
  <>
    {/* dotted arc, top-left */}
    <svg
      className="hidden md:block absolute -left-6 top-24 w-40 h-40 lg:w-52 lg:h-52 opacity-70 pointer-events-none"
      viewBox="0 0 200 200"
      fill="none"
    >
      <path
        d="M10 90 A90 90 0 0 1 170 40"
        stroke="url(#arcGrad)"
        strokeWidth="1"
        strokeDasharray="1 6"
        strokeLinecap="round"
      />
      <circle cx="10" cy="90" r="4" fill="#818CF8" />
      <circle cx="170" cy="40" r="2.5" fill="#818CF8" />
      <defs>
        <linearGradient id="arcGrad" x1="0" y1="0" x2="200" y2="200">
          <stop stopColor="#818CF8" />
          <stop offset="1" stopColor="#818CF8" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>

    {/* ascending path, top-right */}
    <svg
      className="hidden md:block absolute right-2 top-16 w-36 h-36 lg:w-48 lg:h-48 opacity-70 pointer-events-none"
      viewBox="0 0 200 200"
      fill="none"
    >
      <circle
        cx="150"
        cy="30"
        r="34"
        stroke="#6366F1"
        strokeWidth="1"
        opacity="0.5"
      />
      <path
        d="M40 180 L90 130 L120 155 L165 95"
        stroke="#818CF8"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="40" cy="180" r="3" fill="#A5B4FC" />
      <circle cx="165" cy="95" r="3" fill="#A5B4FC" />
    </svg>
  </>
);

const Home = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <main className="relative min-h-screen bg-[#07071c] overflow-hidden">
      <div className="relative min-h-screen overflow-hidden">
        {/* ambient background glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[820px] rounded-full bg-indigo-600/25 blur-[120px]" />
          <div className="absolute top-1/3 -right-40 h-[380px] w-[380px] rounded-full bg-blue-600/15 blur-[100px]" />
        </div>

        <section
          id="product"
          className="scroll-mt-20 md:scroll-mt-24 relative px-4 sm:px-6 lg:px-8 pt-10 sm:pt-20 lg:pt-24 pb-16 sm:pb-24"
        >
          <div className="relative mx-auto max-w-5xl text-center">
            <HeroDecoration />

            <Reveal show={mounted} delay={0} className="flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/25 bg-indigo-500/10 backdrop-blur-md px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-indigo-200 shadow-[0_0_24px_rgba(99,102,241,0.2)]">
                <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse shrink-0" />
                The AI Operating System for Modern Businesses
              </span>
            </Reveal>

            <Reveal show={mounted} delay={100}>
              <h1 className="mt-5 sm:mt-6 text-[2rem] leading-[1.16] sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white text-balance">
                Smarter Business Document Creation With{" "}
                <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                  Ahiia.ai
                </span>
              </h1>
            </Reveal>

            <Reveal show={mounted} delay={180}>
              <p className="mt-4 sm:mt-6 text-sm sm:text-lg leading-relaxed text-slate-300/90 max-w-2xl mx-auto text-balance">
                Ahiia.ai helps businesses, consultants, and agencies streamline
                the creation of proposals, business plans, contracts, SOPs, and
                other business documents faster, smarter, and with confidence.
              </p>
            </Reveal>

            <Reveal show={mounted} delay={260}>
              <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
                <Link
                  to="/signup"
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 px-7 py-3.5 text-sm font-bold text-white transition-all duration-200 shadow-[0_10px_25px_-5px_rgba(99,102,241,0.5)] hover:shadow-[0_0_0_6px_rgba(99,102,241,0.2)] w-full sm:w-auto justify-center active:scale-[0.98]"
                >
                  Get Started Free
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </Link>
                <a
                  href="#how-it-works"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("how-it-works");
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-xs px-7 py-3.5 text-sm font-semibold text-slate-200 hover:bg-white/10 transition-all duration-200 w-full sm:w-auto justify-center active:scale-[0.98]"
                >
                  <Play size={14} className="text-indigo-400 fill-indigo-400" />
                  See How It Works
                </a>
              </div>
            </Reveal>
          </div>

          <div className="relative mx-auto mt-10 sm:mt-16 w-full flex justify-center">
            <HeroMock show={mounted} />
          </div>
        </section>

        <div id="features" className="scroll-mt-20 md:scroll-mt-24">
          <FeaturesSection />
        </div>

        <div id="how-it-works" className="scroll-mt-20 md:scroll-mt-24">
          <AhiiaWorkspace />
        </div>

        <div id="about" className="scroll-mt-20 md:scroll-mt-24">
          <DocumentLibrary />
        </div>

        <div id="ai-quality" className="scroll-mt-20 md:scroll-mt-24">
          <AiQualitySection />
        </div>

        <WaitlistCta />
      </div>
    </main>
  );
};

export default Home;
