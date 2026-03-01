import Stripe from "stripe";

// Lazy singleton — only instantiated when actually called,
// not at module load time (prevents build failures when env vars are absent).

let _instance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_instance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    _instance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
    });
  }
  return _instance;
}

// PRO monthly price created in the Stripe dashboard.
export const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID ?? "";
