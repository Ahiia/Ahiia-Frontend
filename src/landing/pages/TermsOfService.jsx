import React from "react";
import LegalDocumentPage from "./LegalDocumentPage";
import termsMarkdown from "../../content/terms-of-service.md?raw";

const TermsOfService = () => {
  return (
    <LegalDocumentPage
      markdown={termsMarkdown}
      docType="terms"
      badgeText="Terms of Service"
      subtitle="These Terms explain the rules for using AHIIA.AI's website, platform, AI-powered document generators, templates, and related services."
    />
  );
};

export default TermsOfService;
