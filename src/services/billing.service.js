import { api } from "../api/api";
import { safePaystackUrl } from "../config/billing";

export const getBilling = async () => (await api.get("/api/v1/billing")).data;
export const verifyPayment = async (reference) => (await api.get(`/api/v1/billing/payments/${encodeURIComponent(reference)}/verify`)).data;
export const cancelSubscription = async () => (await api.post("/api/v1/billing/subscription/cancel")).data;

export async function startCheckout() {
  const result = (await api.post("/api/v1/billing/checkout")).data;
  if (!safePaystackUrl(result.checkoutUrl)) throw new Error("The payment link could not be verified. Please try again.");
  return result;
}

export async function manageSubscription() {
  const result = (await api.post("/api/v1/billing/subscription/manage")).data;
  if (!safePaystackUrl(result.url, true)) throw new Error("The subscription link could not be verified.");
  return result;
}
