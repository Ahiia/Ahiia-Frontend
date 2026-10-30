export const SITE_URL = "https://ahiia.ai";
export const PUBLIC_PAGES = {
  "/": {
    title: "Ahiia.ai | AI Business Proposals, Plans & Documents",
    description: "Create business proposals, business plans, pitch decks, SOPs, contracts and marketing plans with Ahiia.ai. Built for Nigerian SMEs, consultants and growing teams.",
  },
  "/about": {
    title: "About Ahiia.ai | Business Documents Built Around Your Company",
    description: "Learn how Ahiia.ai combines company knowledge, brand identity and AI assistance to help businesses create, refine and export professional documents.",
  },
  "/contact": {
    title: "Contact Ahiia.ai | Product Questions & Support",
    description: "Get in touch with Ahiia.ai for product questions and help with company profiles, business document creation, branding and exports.",
  },
};

export function pageMetadata(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";
  return PUBLIC_PAGES[path]
    ? { ...PUBLIC_PAGES[path], canonical: SITE_URL + (path === "/" ? "/" : path), robots: "index, follow, max-image-preview:large" }
    : { title: "Ahiia.ai", description: "Your Ahiia.ai workspace.", canonical: null, robots: "noindex, follow" };
}

export function structuredData() {
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "Organization", "@id": SITE_URL + "/#organization", name: "Ahiia.ai", url: SITE_URL + "/",
      logo: SITE_URL + "/ahiia_icon.svg", description: PUBLIC_PAGES["/"].description,
      sameAs: ["https://www.instagram.com/ahiia.ai/"] },
    { "@type": "WebSite", "@id": SITE_URL + "/#website", name: "Ahiia.ai", url: SITE_URL + "/",
      publisher: { "@id": SITE_URL + "/#organization" } },
  ] };
}
