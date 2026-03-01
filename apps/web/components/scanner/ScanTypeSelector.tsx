"use client";

import { Shield, Package, Globe, GitBranch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type ScanType = "skill" | "npm" | "url" | "github";

interface ScanTypeOption {
  id:       ScanType;
  label:    string;
  sub:      string;
  icon:     React.ElementType;
  ready:    boolean;
}

const OPTIONS: ScanTypeOption[] = [
  {
    id:    "skill",
    label: "OpenClaw Skill",
    sub:   "Skill files or crawsecure.json",
    icon:  Shield,
    ready: true,
  },
  {
    id:    "npm",
    label: "NPM Package",
    sub:   "Scan any npm package",
    icon:  Package,
    ready: false,
  },
  {
    id:    "url",
    label: "Website",
    sub:   "Passive header & CSP audit",
    icon:  Globe,
    ready: false,
  },
  {
    id:    "github",
    label: "GitHub Repo",
    sub:   "Public repository scan",
    icon:  GitBranch,
    ready: false,
  },
];

interface Props {
  selected: ScanType;
  onChange: (type: ScanType) => void;
}

export function ScanTypeSelector({ selected, onChange }: Props) {
  return (
    <div className="w-full max-w-xl">
      <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">
        What do you want to analyse?
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {OPTIONS.map(({ id, label, sub, icon: Icon, ready }) => {
          const active = selected === id;
          return (
            <button
              key={id}
              disabled={!ready}
              onClick={() => ready && onChange(id)}
              className={cn(
                "flex flex-col items-start gap-1.5 rounded-xl border px-3 py-3 text-left transition-all",
                active
                  ? "border-primary bg-primary/5 shadow-sm"
                  : ready
                    ? "border-border hover:border-primary/40 hover:bg-muted/40"
                    : "border-border/50 bg-muted/20 opacity-50 cursor-not-allowed",
              )}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg",
                    active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                {!ready && (
                  <Badge variant="outline" className="text-[9px] h-4 px-1.5 font-medium">
                    Soon
                  </Badge>
                )}
                {active && ready && (
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </div>
              <div>
                <p className={cn("text-xs font-semibold leading-tight", active ? "text-primary" : "text-foreground")}>
                  {label}
                </p>
                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{sub}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
