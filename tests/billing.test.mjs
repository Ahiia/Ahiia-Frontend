import test from "node:test";
import assert from "node:assert/strict";
import { canCreateDocument, DOCUMENT_ACCESS, paymentMessage, PRO_AMOUNT_MINOR, PRO_CURRENCY, PRO_PRICE, safePaystackUrl } from "../src/config/billing.js";

test("Free permits only proposals and an expired session never assumes Pro", () => {
  assert.equal(PRO_PRICE, 10);
  assert.equal(PRO_CURRENCY, "NGN");
  assert.equal(PRO_AMOUNT_MINOR, 1346257);
  for (const doc of DOCUMENT_ACCESS) {
    assert.equal(canCreateDocument({ allowedDocumentTypes: ["Proposal"] }, doc.slug), Boolean(doc.free));
    assert.equal(canCreateDocument(null, doc.slug), Boolean(doc.free));
  }
  assert.equal(canCreateDocument({ plan: "Pro" }, "contract"), false);
  assert.equal(canCreateDocument(null, "invented-type"), false);
});
test("Pro access comes from server entitlements for all six types", () => {
  const billing = { allowedDocumentTypes: DOCUMENT_ACCESS.map((doc) => doc.type) };
  assert.equal(DOCUMENT_ACCESS.length, 6);
  for (const doc of DOCUMENT_ACCESS) assert.equal(canCreateDocument(billing, doc.slug), true);
});
test("payment redirects accept only exact Paystack HTTPS hosts", () => {
  assert.equal(safePaystackUrl("https://checkout.paystack.com/abc"), true);
  assert.equal(safePaystackUrl("https://paystack.com/manage/subscriptions/abc", true), true);
  for (const bad of ["javascript:alert(1)", "http://checkout.paystack.com/a", "https://checkout.paystack.com.evil.test/a", "https://evil.test/a", null]) assert.equal(safePaystackUrl(bad), false);
});
test("returning from checkout never claims success before verified Paid status", () => {
  assert.equal(paymentMessage("Pending").tone, "pending");
  assert.equal(paymentMessage(null).tone, "pending");
  assert.equal(paymentMessage("Failed").tone, "error");
  assert.equal(paymentMessage("Refunded").tone, "error");
  assert.equal(paymentMessage("Paid").tone, "success");
});
