"use client";

import { useState }   from "react";
import { useRouter }  from "next/navigation";
import { Button }     from "@/components/ui/button";

interface Props {
  scanId: string;
}

export function DeleteScanButton({ scanId }: Props) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "confirm" | "deleting">("idle");

  async function handleDelete() {
    setState("deleting");
    try {
      await fetch(`/api/scans/${scanId}`, { method: "DELETE" });
    } finally {
      router.push("/dashboard");
      router.refresh();
    }
  }

  if (state === "confirm") {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Delete this scan?</span>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          Confirm
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setState("idle")}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-muted-foreground hover:text-destructive"
      onClick={() => setState("confirm")}
      disabled={state === "deleting"}
    >
      {state === "deleting" ? "Deleting…" : "Delete scan"}
    </Button>
  );
}
