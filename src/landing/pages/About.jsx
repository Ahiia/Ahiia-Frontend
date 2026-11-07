import React from "react";
import { FiArrowRight, FiCheckCircle, FiFileText, FiLayers } from "react-icons/fi";

const About = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Banner */}
      <section className="bg-[#0B0B24] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-1 text-xs font-medium text-indigo-300 mb-4">
            About Us
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
            About Ahiia.ai
          </h1>
          <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Ahiia.ai helps businesses turn their company knowledge into professional business documents. It brings company information, brand identity and AI assistance into one workspace for Nigerian SMEs, consultants and growing teams.
          </p>
        </div>
      </section>

      {/* Content Cards */}
      <article className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16 space-y-6 sm:space-y-8 text-slate-800">
        <div className="rounded-2xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-4">
            <FiFileText className="h-5 w-5" />
          </div>
          <h2 className="mb-3 text-xl sm:text-2xl font-bold text-slate-900">
            Documents built around your business
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Create business proposals, business plans, pitch decks, standard operating procedures, contracts and marketing plans. Start with your business context, review the generated content, refine individual sections and export the document when it is ready.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-4">
            <FiLayers className="h-5 w-5" />
          </div>
          <h2 className="mb-3 text-xl sm:text-2xl font-bold text-slate-900">
            Consistent company identity
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Your company profile and Brand Kit keep your business description, logo, colours and writing context available across documents. Review important facts, commercial terms and legal content before sharing a final document.
          </p>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-[#0B0B24] to-[#1a1f4e] p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold">Ready to build your first document?</h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-300">
              Set up your company profile once and generate structured business documents in minutes.
            </p>
          </div>
          <a
            href="/signup"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition shrink-0"
          >
            Create your Ahiia.ai account
            <FiArrowRight className="h-4 w-4" />
          </a>
        </div>
      </article>
    </div>
  );
};

export default About;
