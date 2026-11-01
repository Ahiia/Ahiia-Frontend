import assert from "node:assert/strict";
import { test } from "node:test";
import { exportDocumentMetadata } from "../src/config/exportDocumentMetadata.js";

test("documents reopened without navigation state retain their backend export type", () => {
  for (const [documentType, type, label] of [
    ["Proposal", "business-proposal", "Business Proposal"],
    ["BusinessPlan", "business-plan", "Business Plan"],
    ["SOP", "sop", "SOP"],
    ["Contract", "contract", "Contract"],
    ["MarketingPlan", "marketing-plan", "Marketing Plan"],
    ["PitchDeck", "pitch-deck", "Pitch Deck"],
  ]) {
    assert.deepEqual(exportDocumentMetadata({ documentType, title: "A custom document title" }), { type, label });
  }
});

test("saved backend metadata takes precedence over stale navigation data", () => {
  assert.equal(exportDocumentMetadata({ slug: "business-proposal" }, "pitch-deck").type, "business-proposal");
  assert.equal(exportDocumentMetadata({ documentTypeLabel: "Marketing Plan" }).type, "marketing-plan");
});

test("new documents use a supported navigation type or a proposal default", () => {
  assert.equal(exportDocumentMetadata(null, "pitch-deck").type, "pitch-deck");
  assert.equal(exportDocumentMetadata(null).type, "business-proposal");
});
