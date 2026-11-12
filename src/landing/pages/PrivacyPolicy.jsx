import React from "react";
import LegalDocumentPage from "./LegalDocumentPage";
import privacyMarkdown from "../../content/privacy-policy.md?raw";

const PrivacyPolicy = () => {
  return (
    <LegalDocumentPage
      markdown={privacyMarkdown}
      docType="privacy"
      badgeText="Privacy Policy"
      subtitle="How AHIIA.AI collects, uses, and protects your personal and business information under the Nigeria Data Protection Act 2023 and applicable laws."
    />
  );
};

export default PrivacyPolicy;
