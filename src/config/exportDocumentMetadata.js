const TYPES = {
  proposal: { type: "business-proposal", label: "Business Proposal" },
  businessproposal: { type: "business-proposal", label: "Business Proposal" },
  businessplan: { type: "business-plan", label: "Business Plan" },
  sop: { type: "sop", label: "SOP" },
  contract: { type: "contract", label: "Contract" },
  marketingplan: { type: "marketing-plan", label: "Marketing Plan" },
  pitchdeck: { type: "pitch-deck", label: "Pitch Deck" },
};

export function exportDocumentMetadata(document, navigationType) {
  for (const value of [document?.slug, document?.documentType, document?.documentTypeLabel, navigationType]) {
    const key = String(value || "").toLowerCase().replace(/[^a-z]/g, "");
    if (TYPES[key]) return TYPES[key];
  }
  return TYPES.proposal;
}
