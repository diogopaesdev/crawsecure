"use client";

import { useState } from "react";
import { Button }   from "@/components/ui/button";

export function CheckoutButton() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json() as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        size="lg"
        className="w-full bg-violet-600 hover:bg-violet-700"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? "Redirecting to Stripe…" : "Continue to payment →"}
      </Button>
      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}
      <p className="text-center text-xs text-muted-foreground">
        Secure checkout via Stripe · Cancel anytime
      </p>
    </div>
  );
}
