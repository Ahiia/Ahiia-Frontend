import React from "react";

const Contact = () => {
  return <article className="mx-auto max-w-4xl px-6 py-16 text-slate-800">
    <h1 className="mb-6 text-4xl font-bold">Contact Ahiia.ai</h1>
    <p className="mb-6 text-lg">Have a question about Ahiia.ai, company profiles, Brand Kits or business document creation? Connect with our team through the official Ahiia.ai Instagram page.</p>
    <a href="https://www.instagram.com/ahiia.ai/" target="_blank" rel="noopener noreferrer" className="font-semibold text-indigo-700 underline">Contact @ahiia.ai on Instagram</a>
    <h2 className="mb-3 mt-10 text-2xl font-semibold">Help with your workspace</h2>
    <p className="mb-6">If you already have an account, sign in to use Help &amp; Support in your dashboard. For an export issue, include the document type, selected format, browser and the error message so the team can investigate.</p>
    <a href="/dashboard/help" className="font-semibold text-indigo-700 underline">Open workspace Help &amp; Support</a>
  </article>;
};

export default Contact;
