import React from "react";
import { FiInstagram, FiHelpCircle, FiArrowUpRight } from "react-icons/fi";

const Contact = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Banner */}
      <section className="bg-[#0B0B24] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-1 text-xs font-medium text-indigo-300 mb-4">
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
            Contact Ahiia.ai
          </h1>
          <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Have a question about Ahiia.ai, company profiles, Brand Kits or business document creation? We’re here to help your business succeed.
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16 grid grid-cols-1 sm:grid-cols-2 gap-6 text-slate-800">
        <div className="rounded-2xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-pink-600 mb-4">
              <FiInstagram className="h-5 w-5" />
            </div>
            <h2 className="mb-2.5 text-xl font-bold text-slate-900">
              Connect on Instagram
            </h2>
            <p className="mb-6 text-sm text-slate-600 leading-relaxed">
              Connect directly with our team for product updates, tips, and quick inquiries through the official Ahiia.ai Instagram page.
            </p>
          </div>
          <a
            href="https://www.instagram.com/ahiia.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
          >
            Contact @ahiia.ai on Instagram
            <FiArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="rounded-2xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-4">
              <FiHelpCircle className="h-5 w-5" />
            </div>
            <h2 className="mb-2.5 text-xl font-bold text-slate-900">
              Help with your workspace
            </h2>
            <p className="mb-6 text-sm text-slate-600 leading-relaxed">
              If you already have an account, sign in to use Help &amp; Support in your dashboard. For an export issue, include the document type, selected format, browser and error message.
            </p>
          </div>
          <a
            href="/dashboard/help"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition"
          >
            Open workspace Help &amp; Support
            <FiArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </article>
    </div>
  );
};

export default Contact;
