"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SuccessView() {
  const { update } = useSession();

  // Refresh the session JWT to pick up plan: "pro" from Firestore
  useEffect(() => {
    update();
  }, [update]);

  return (
    <div className="flex flex-col items-center gap-6 py-16 text-center">
      <span className="text-6xl">🎉</span>
      <h1 className="text-2xl font-semibold">You are now on PRO!</h1>
      <p className="text-muted-foreground text-sm max-w-sm">
        Unlimited scans, advanced rules, and full history are now unlocked.
        Your code still never leaves your machine.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/analyze">Start scanning</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard">View dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
