// Rule IDs are stable identifiers used in crawsecure.json and web reports.
// Never remove or rename an ID — only add new ones.

export const DANGEROUS_PATTERNS = [
  { id: "rm-rf",        regex: /rm\s+-rf/,        level: "high",   message: "Destructive rm -rf command" },
  { id: "child-process",regex: /child_process/,   level: "medium", message: "Executes system commands" },
  { id: "eval",         regex: /\beval\s*\(/,      level: "high",   message: "Dynamic code execution via eval()" },
  { id: "exec",         regex: /\bexec\s*\(/,      level: "high",   message: "Process execution via exec()" },
  { id: "spawn",        regex: /\bspawn\s*\(/,     level: "medium", message: "Child process via spawn()" },
  { id: "curl",         regex: /\bcurl\b/,         level: "medium", message: "Network request via curl" },
  { id: "wget",         regex: /\bwget\b/,         level: "medium", message: "File download via wget" },
  { id: "process-env",  regex: /process\.env/,     level: "low",    message: "Access to environment variables" },
];

export const SENSITIVE_FILE_PATTERNS = [
  { id: "dotenv",       regex: /\.env\b/,          level: "medium", message: "References .env file (secrets)" },
  { id: "ssh-dir",      regex: /\.ssh/,            level: "high",   message: "References .ssh directory" },
  { id: "id-rsa",       regex: /id_rsa/,           level: "high",   message: "References SSH private key (id_rsa)" },
  { id: "wallet",       regex: /wallet/,           level: "medium", message: "References wallet file" },
  { id: "credentials",  regex: /credentials/,      level: "medium", message: "References credentials file" },
];

export const ALL_PATTERNS = [...DANGEROUS_PATTERNS, ...SENSITIVE_FILE_PATTERNS];
