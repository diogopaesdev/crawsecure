export const DANGEROUS_PATTERNS = [
  { regex: /rm\s+-rf/, level: "high", message: "Destructive rm -rf command" },
  { regex: /child_process/, level: "medium", message: "Executes system commands" },
  { regex: /\beval\s*\(/, level: "high", message: "Dynamic code execution via eval()" },
  { regex: /\bexec\s*\(/, level: "high", message: "Process execution via exec()" },
  { regex: /\bspawn\s*\(/, level: "medium", message: "Child process via spawn()" },
  { regex: /\bcurl\b/, level: "medium", message: "Network request via curl" },
  { regex: /\bwget\b/, level: "medium", message: "File download via wget" },
  { regex: /process\.env/, level: "low", message: "Access to environment variables" },
];

export const SENSITIVE_FILE_PATTERNS = [
  { regex: /\.env\b/, level: "medium", message: "References .env file (secrets)" },
  { regex: /\.ssh/, level: "high", message: "References .ssh directory" },
  { regex: /id_rsa/, level: "high", message: "References SSH private key (id_rsa)" },
  { regex: /wallet/, level: "medium", message: "References wallet file" },
  { regex: /credentials/, level: "medium", message: "References credentials file" },
];
