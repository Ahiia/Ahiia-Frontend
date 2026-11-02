export const PRO_PRICE = 10;
export const PRO_CURRENCY = "NGN";
// Fixed monthly launch price, based on CBN NFEM 2026-10-30: 1346.2565 NGN/USD.
// Updating this price requires a new matching Paystack plan and a coordinated API/UI release.
export const PRO_AMOUNT_MINOR = 1346257;
export const PRO_PRICE_LABEL = "₦13,462.57";
export const PRO_RATE_DATE = "30 October 2026";
export const DOCUMENT_ACCESS = [
  { type: "Proposal", slug: "business-proposal", label: "Business Proposals", free: true },
  { type: "BusinessPlan", slug: "business-plan", label: "Business Plans" },
  { type: "PitchDeck", slug: "pitch-deck", label: "Pitch Decks" },
  { type: "SOP", slug: "sop", label: "Standard Operating Procedures" },
  { type: "Contract", slug: "contract", label: "Contracts" },
  { type: "MarketingPlan", slug: "marketing-plan", label: "Marketing Plans" },
];

export function canCreateDocument(billing, slug) {
  const doc = DOCUMENT_ACCESS.find((item) => item.slug === slug);
  return Boolean(doc && (doc.free || billing?.allowedDocumentTypes?.includes(doc.type)));
}

export function safePaystackUrl(value, manage = false) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === (manage ? "paystack.com" : "checkout.paystack.com");
  } catch { return false; }
}

export function paymentMessage(status) {
  if (status === "Paid") return { tone: "success", title: "Payment confirmed. You’re Pro.", detail: "Your payment is verified and all six document types are ready to use." };
  if (status === "Failed") return { tone: "error", title: "Payment wasn’t completed", detail: "Pro hasn’t been activated. You can try checkout again or continue with free Business Proposals." };
  if (status === "Refunded") return { tone: "error", title: "This payment was refunded", detail: "Your current access is shown below. Contact support if you need help with this payment." };
  return { tone: "pending", title: "We’re checking your payment", detail: "Your return from checkout isn’t payment confirmation. We’ll unlock Pro once Paystack confirms the payment." };
}
