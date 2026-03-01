// Rule ID → human-readable metadata for the web UI.
// Keep in sync with packages/core/src/rules.js

export type RuleLevel = "high" | "medium" | "low";

export interface RuleMeta {
  label:    string;
  level:    RuleLevel;
  category: "dangerous-command" | "sensitive-file" | "network" | "env";
}

export const RULES_META: Record<string, RuleMeta> = {
  "rm-rf":         { label: "Destructive rm -rf command",          level: "high",   category: "dangerous-command" },
  "child-process": { label: "Executes system commands",            level: "medium", category: "dangerous-command" },
  "eval":          { label: "Dynamic code execution via eval()",   level: "high",   category: "dangerous-command" },
  "exec":          { label: "Process execution via exec()",        level: "high",   category: "dangerous-command" },
  "spawn":         { label: "Child process via spawn()",           level: "medium", category: "dangerous-command" },
  "curl":          { label: "Network request via curl",            level: "medium", category: "network"           },
  "wget":          { label: "File download via wget",              level: "medium", category: "network"           },
  "process-env":   { label: "Accesses environment variables",      level: "low",    category: "env"               },
  "dotenv":        { label: "References .env file (secrets)",      level: "medium", category: "sensitive-file"    },
  "ssh-dir":       { label: "References .ssh directory",           level: "high",   category: "sensitive-file"    },
  "id-rsa":        { label: "References SSH private key (id_rsa)", level: "high",   category: "sensitive-file"    },
  "wallet":        { label: "References wallet file",              level: "medium", category: "sensitive-file"    },
  "credentials":   { label: "References credentials file",         level: "medium", category: "sensitive-file"    },
};

export function getRuleMeta(ruleId: string): RuleMeta {
  return RULES_META[ruleId] ?? { label: ruleId, level: "low", category: "dangerous-command" };
}
