"use client";

import { Shield, Package, Globe, GitBranch } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type ScanType = "skill" | "npm" | "url" | "github";

interface ScanTypeOption {
  id:    ScanType;
  icon:  React.ElementType;
  ready: boolean;
}

const OPTIONS: ScanTypeOption[] = [
  { id: "skill",  icon: Shield,    ready: true  },
  { id: "npm",    icon: Package,   ready: false },
  { id: "url",    icon: Globe,     ready: false },
  { id: "github", icon: GitBranch, ready: false },
];

// Explicit key maps to keep TypeScript happy with next-intl's typed t()
const LABEL_KEYS: Record<ScanType, "types.skill.label" | "types.npm.label" | "types.url.label" | "types.github.label"> = {
  skill:  "types.skill.label",
  npm:    "types.npm.label",
  url:    "types.url.label",
  github: "types.github.label",
};

const SUB_KEYS: Record<ScanType, "types.skill.sub" | "types.npm.sub" | "types.url.sub" | "types.github.sub"> = {
  skill:  "types.skill.sub",
  npm:    "types.npm.sub",
  url:    "types.url.sub",
  github: "types.github.sub",
};

interface Props {
  selected: ScanType;
  onChange: (type: ScanType) => void;
}

export function ScanTypeSelector({ selected, onChange }: Props) {
  const t  = useTranslations("scanner");
  const ta = useTranslations("analyze");
  const tc = useTranslations("common");
  return (
    <div className="w-full max-w-xl">
      <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">
        {ta("typeLabel")}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {OPTIONS.map(({ id, icon: Icon, ready }) => {
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
                    {tc("soon")}
                  </Badge>
                )}
                {active && ready && (
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </div>
              <div>
                <p className={cn("text-xs font-semibold leading-tight", active ? "text-primary" : "text-foreground")}>
                  {t(LABEL_KEYS[id])}
                </p>
                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                  {t(SUB_KEYS[id])}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
