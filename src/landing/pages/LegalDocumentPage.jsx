import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { FiFileText, FiShield, FiMail, FiExternalLink, FiArrowRight } from "react-icons/fi";

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Renders inline markdown (**bold**, URLs, emails, and Privacy Policy / Terms of Service cross-links)
 */
function renderInlineMarkdown(text, currentDocType) {
  if (!text) return null;
  const cleaned = text.replace(/\\$/, "").trim();

  // Tokenize by **bold**, https:// URLs, and email addresses
  const pattern = /(\*\*[^*]+\*\*|https?:\/\/[^\s,)]+|consultahiiaai@gmail\.com)/g;
  const parts = cleaned.split(pattern);

  return parts.map((part, idx) => {
    if (!part) return null;

    if (part.startsWith("**") && part.endsWith("**")) {
      const inner = part.slice(2, -2);
      return (
        <strong key={idx} className="font-semibold text-slate-900">
          {inner}
        </strong>
      );
    }

    if (part === "consultahiiaai@gmail.com") {
      return (
        <a
          key={idx}
          href="mailto:consultahiiaai@gmail.com"
          className="font-medium text-indigo-600 underline decoration-indigo-300 underline-offset-2 hover:text-indigo-700"
        >
          {part}
        </a>
      );
    }

    if (/^https?:\/\//.test(part)) {
      return (
        <a
          key={idx}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-indigo-600 underline decoration-indigo-300 underline-offset-2 hover:text-indigo-700"
        >
          {part}
          <FiExternalLink className="h-3.5 w-3.5 shrink-0" />
        </a>
      );
    }

    // Link "Privacy Policy" when viewing Terms, or "Terms of Service" when viewing Privacy
    if (currentDocType === "terms" && part.includes("Privacy Policy")) {
      const subParts = part.split(/(Privacy Policy)/g);
      return (
        <React.Fragment key={idx}>
          {subParts.map((sp, sIdx) =>
            sp === "Privacy Policy" ? (
              <Link
                key={sIdx}
                to="/privacy"
                className="font-medium text-indigo-600 underline decoration-indigo-300 underline-offset-2 hover:text-indigo-700"
              >
                Privacy Policy
              </Link>
            ) : (
              sp
            )
          )}
        </React.Fragment>
      );
    }

    if (currentDocType === "privacy" && part.includes("Terms of Service")) {
      const subParts = part.split(/(Terms of Service)/g);
      return (
        <React.Fragment key={idx}>
          {subParts.map((sp, sIdx) =>
            sp === "Terms of Service" ? (
              <Link
                key={sIdx}
                to="/terms"
                className="font-medium text-indigo-600 underline decoration-indigo-300 underline-offset-2 hover:text-indigo-700"
              >
                Terms of Service
              </Link>
            ) : (
              sp
            )
          )}
        </React.Fragment>
      );
    }

    return part;
  });
}

/**
 * Parses a legal markdown document into structured metadata and sections.
 */
function parseLegalMarkdown(markdown) {
  const lines = String(markdown || "").replace(/\r\n/g, "\n").split("\n");
  let title = "";
  let effectiveDate = "";
  let lastUpdated = "";
  const sections = [];
  let currentSection = null;
  let currentList = null;

  const flushList = () => {
    if (currentList && currentSection) {
      currentSection.blocks.push(currentList);
      currentList = null;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushList();
      continue;
    }

    if (line.startsWith("# ")) {
      flushList();
      title = line.slice(2).trim();
      continue;
    }

    if (line.startsWith("**Effective date:**")) {
      effectiveDate = line
        .replace("**Effective date:**", "")
        .replace(/\\$/, "")
        .trim();
      continue;
    }

    if (line.startsWith("**Last updated:**")) {
      lastUpdated = line
        .replace("**Last updated:**", "")
        .replace(/\\$/, "")
        .trim();
      continue;
    }

    if (line.startsWith("## ")) {
      flushList();
      const heading = line.slice(3).trim();
      currentSection = {
        id: slugify(heading),
        heading,
        blocks: [],
      };
      sections.push(currentSection);
      continue;
    }

    if (!currentSection) {
      currentSection = {
        id: "overview",
        heading: "Overview",
        blocks: [],
      };
      sections.push(currentSection);
    }

    if (line.startsWith("### ")) {
      flushList();
      currentSection.blocks.push({
        type: "subheading",
        text: line.slice(4).trim(),
      });
      continue;
    }

    if (line.startsWith("- ")) {
      const itemText = line.slice(2).trim();
      if (!currentList || currentList.type !== "ul") {
        flushList();
        currentList = { type: "ul", items: [] };
      }
      currentList.items.push(itemText);
      continue;
    }

    const orderedMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (orderedMatch) {
      const itemText = orderedMatch[2].trim();
      if (!currentList || currentList.type !== "ol") {
        flushList();
        currentList = { type: "ol", items: [] };
      }
      currentList.items.push(itemText);
      continue;
    }

    flushList();
    currentSection.blocks.push({
      type: "paragraph",
      text: line,
    });
  }

  flushList();

  return {
    title,
    effectiveDate,
    lastUpdated,
    sections,
  };
}

const LegalDocumentPage = ({
  markdown,
  docType = "terms",
  badgeText = "Legal Agreement",
  subtitle = "",
}) => {
  const parsed = useMemo(() => parseLegalMarkdown(markdown), [markdown]);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Banner */}
      <section className="bg-[#0B0B24] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-medium text-indigo-300">
              {docType === "terms" ? (
                <FiFileText className="h-3.5 w-3.5" />
              ) : (
                <FiShield className="h-3.5 w-3.5" />
              )}
              {badgeText}
            </span>

            {/* Switcher between Terms of Service & Privacy Policy */}
            <div className="inline-flex rounded-xl bg-white/5 p-1 border border-white/10">
              <Link
                to="/terms"
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  docType === "terms"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Terms of Service
              </Link>
              <Link
                to="/privacy"
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  docType === "privacy"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Privacy Policy
              </Link>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
            {parsed.title || (docType === "terms" ? "AHIIA.AI Terms of Service" : "AHIIA.AI Privacy Policy")}
          </h1>

          {subtitle && (
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          )}

          {(parsed.effectiveDate || parsed.lastUpdated) && (
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-300">
              {parsed.effectiveDate && (
                <span className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5">
                  <strong className="font-semibold text-white">Effective date:</strong>{" "}
                  {parsed.effectiveDate}
                </span>
              )}
              {parsed.lastUpdated && (
                <span className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5">
                  <strong className="font-semibold text-white">Last updated:</strong>{" "}
                  {parsed.lastUpdated}
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sticky Table of Contents on Desktop */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24">
            <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                On this page
              </p>
              <nav className="space-y-1 max-h-[70vh] overflow-y-auto pr-1">
                {parsed.sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="block rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700 truncate"
                  >
                    {sec.heading}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Rendered Markdown Sections */}
          <article className="lg:col-span-8 space-y-5 sm:space-y-6">
            {parsed.sections.map((sec) => (
              <section
                key={sec.id}
                id={sec.id}
                className="scroll-mt-24 rounded-2xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-xs"
              >
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
                  {sec.heading}
                </h2>

                <div className="space-y-3.5 text-sm sm:text-[15px] text-slate-600 leading-relaxed">
                  {sec.blocks.map((block, bIdx) => {
                    if (block.type === "subheading") {
                      return (
                        <h3
                          key={bIdx}
                          className="text-sm sm:text-base font-semibold text-slate-900 pt-2"
                        >
                          {block.text}
                        </h3>
                      );
                    }

                    if (block.type === "ul") {
                      return (
                        <ul key={bIdx} className="space-y-2 pl-1">
                          {block.items.map((item, iIdx) => (
                            <li key={iIdx} className="flex items-start gap-2.5">
                              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-indigo-600 shrink-0" />
                              <span>{renderInlineMarkdown(item, docType)}</span>
                            </li>
                          ))}
                        </ul>
                      );
                    }

                    if (block.type === "ol") {
                      return (
                        <ol key={bIdx} className="space-y-2.5 pl-1">
                          {block.items.map((item, iIdx) => (
                            <li key={iIdx} className="flex items-start gap-3">
                              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-[11px] font-bold text-indigo-700">
                                {iIdx + 1}
                              </span>
                              <span>{renderInlineMarkdown(item, docType)}</span>
                            </li>
                          ))}
                        </ol>
                      );
                    }

                    return (
                      <p key={bIdx}>
                        {renderInlineMarkdown(block.text, docType)}
                      </p>
                    );
                  })}
                </div>
              </section>
            ))}

            {/* Bottom Contact / Companion Document Card */}
            <div className="rounded-2xl bg-gradient-to-r from-[#0B0B24] to-[#1a1f4e] p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold">
                  {docType === "terms"
                    ? "Looking for our Privacy Policy?"
                    : "Looking for our Terms of Service?"}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-300">
                  {docType === "terms"
                    ? "Read how AHIIA.AI collects, uses, and protects your personal and business information."
                    : "Review the rules and terms governing your use of the AHIIA.AI platform and services."}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link
                  to={docType === "terms" ? "/privacy" : "/terms"}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition"
                >
                  {docType === "terms" ? "View Privacy Policy" : "View Terms of Service"}
                  <FiArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="mailto:consultahiiaai@gmail.com"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-white/10 transition"
                >
                  <FiMail className="h-4 w-4" />
                  Contact Legal
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default LegalDocumentPage;
