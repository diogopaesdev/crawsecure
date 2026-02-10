# CrawSecure

**Security scanner for ClawHub skills.**

CrawSecure analyzes skill source code before installation to detect potential security risks. It runs offline, is read-only, and never sends data anywhere.

## What it does

- Scans `.js`, `.ts`, `.json`, and `.sh` files
- Detects dangerous commands (`rm -rf`, `eval`, `exec`, `spawn`, `curl`, `wget`)
- Detects sensitive file access (`.env`, `.ssh`, `id_rsa`, `wallet`, `credentials`)
- Classifies risk as SAFE, MEDIUM, or HIGH
- Outputs a clear, actionable report

## Usage

```bash
crawsecure <path-to-skill>
```

## Trust

- Read-only: never modifies scanned files
- Offline: no network requests
- No data exfiltration: nothing leaves your machine
- Open source: inspect every line at github.com/crawsecure/crawsecure
