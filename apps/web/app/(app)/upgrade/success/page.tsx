import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Welcome to PRO" };

export default function UpgradeSuccessPage() {
  return (
    <div className="flex flex-col items-center gap-6 py-16 text-center">
      <span className="text-6xl">🎉</span>
      <h1 className="text-2xl font-semibold">You are now on PRO!</h1>
      <p className="text-muted-foreground text-sm max-w-sm">
        Unlimited scans, advanced rules, and full history are now unlocked.
        Your code still never leaves your machine.
      </p>
      <Button asChild>
        <Link href="/analyze">Start scanning</Link>
      </Button>
    </div>
  );
}
