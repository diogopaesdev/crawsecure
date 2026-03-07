"use client";

import { useState } from "react";
import { Button }   from "@/components/ui/button";

interface Props {
  hasKey:      boolean;
  createdDate: string | null;
  labels: {
    desc:          string;
    none:          string;
    created:       string;
    regenerate:    string;
    regenerating:  string;
    newKey:        string;
  };
}

export function CliApiKeySection({ hasKey, createdDate, labels }: Props) {
  const [loading,  setLoading]  = useState(false);
  const [newToken, setNewToken] = useState<string | null>(null);
  const [copied,   setCopied]   = useState(false);

  async function handleRegenerate() {
    setLoading(true);
    setNewToken(null);
    try {
      const res  = await fetch("/api/auth/cli/regenerate", { method: "POST" });
      const data = await res.json() as { token?: string };
      if (data.token) setNewToken(data.token);
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!newToken) return;
    await navigator.clipboard.writeText(newToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const maskedKey = hasKey && !newToken ? "cws_" + "•".repeat(20) : null;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">{labels.desc}</p>

      {newToken ? (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-amber-600 font-medium">{labels.newKey}</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 font-mono text-xs bg-muted rounded px-3 py-2 break-all select-all">
              {newToken}
            </code>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>
      ) : maskedKey ? (
        <div className="flex flex-col gap-1">
          <code className="font-mono text-xs bg-muted rounded px-3 py-2">{maskedKey}</code>
          {createdDate && (
            <p className="text-xs text-muted-foreground">
              {labels.created.replace("{date}", createdDate)}
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{labels.none}</p>
      )}

      <Button
        variant="outline"
        size="sm"
        className="self-start"
        onClick={handleRegenerate}
        disabled={loading}
      >
        {loading ? labels.regenerating : labels.regenerate}
      </Button>
    </div>
  );
}
