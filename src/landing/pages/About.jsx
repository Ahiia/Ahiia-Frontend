import React from "react";

const About = () => {
  return <article className="mx-auto max-w-4xl px-6 py-16 text-slate-800">
    <h1 className="mb-6 text-4xl font-bold">About Ahiia.ai</h1>
    <p className="mb-5 text-lg">Ahiia.ai helps businesses turn their company knowledge into professional business documents. It brings company information, brand identity and AI assistance into one workspace for Nigerian SMEs, consultants and growing teams.</p>
    <h2 className="mb-3 mt-10 text-2xl font-semibold">Documents built around your business</h2>
    <p className="mb-5">Create business proposals, business plans, pitch decks, standard operating procedures, contracts and marketing plans. Start with your business context, review the generated content, refine individual sections and export the document when it is ready.</p>
    <h2 className="mb-3 mt-10 text-2xl font-semibold">Consistent company identity</h2>
    <p className="mb-8">Your company profile and Brand Kit keep your business description, logo, colours and writing context available across documents. Review important facts, commercial terms and legal content before sharing a final document.</p>
    <a href="/signup" className="font-semibold text-indigo-700 underline">Create your Ahiia.ai account</a>
  </article>;
};

export default About;
