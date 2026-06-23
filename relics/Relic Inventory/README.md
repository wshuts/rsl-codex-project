# Relic Inventory Update Guide

## Purpose

`build-relic-inventory.ps1` converts the newest private account snapshot into the sanitized relic and gemstone inventory used by the project.

## Prepare the Snapshot

Place the new account snapshot in the central snapshot directory:

```text
C:\dev\rsl-codex-project\data-account-specific-dynamic\snapshots
```

Give it a two-digit ring-buffer name such as:

```text
account-response-09-private.json
```

Automation uses `account-response-00-private.json` through `account-response-99-private.json`. After `99`, it reuses the oldest snapshot slot. The current snapshot is recorded in:

```text
current-account-snapshot.txt
```

When no `-AccountPath` is supplied, the script selects the snapshot named by that marker. If the marker is missing, it falls back to the most recently modified two-digit snapshot. It prints the selected filename before processing.

The generated inventory overwrites:

```text
relic-inventory-sanitized.json
```

## Run From Windows PowerShell

PowerShell is the more convenient console when inspecting JSON, passing parameters, or troubleshooting interactively.

### One-command invocation

This starts a child PowerShell process with a temporary execution-policy bypass:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "C:\dev\rsl-codex-project\relics\Relic Inventory\build-relic-inventory.ps1"
```

The bypass ends when the command finishes and does not permanently change the machine's execution policy.

### Bypass for the current PowerShell window

Alternatively, enable the bypass only for the current console process:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Then run the script directly:

```powershell
& "C:\dev\rsl-codex-project\relics\Relic Inventory\build-relic-inventory.ps1"
```

Closing that PowerShell window discards the process-scoped setting.

## Run From Command Prompt

From `cmd.exe`, explicitly launch PowerShell:

```cmd
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "C:\dev\rsl-codex-project\relics\Relic Inventory\build-relic-inventory.ps1"
```

The generated inventory is identical regardless of whether the command originated in PowerShell or Command Prompt.

## Select a Snapshot Explicitly

Use `-AccountPath` to override automatic snapshot selection:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "C:\dev\rsl-codex-project\relics\Relic Inventory\build-relic-inventory.ps1" -AccountPath "C:\path\to\account-response-09-private.json"
```

## Verify the Update

Before relying on the regenerated inventory, confirm:

1. The script printed the expected account snapshot filename.
2. The reported relic and gemstone totals are plausible.
3. `relic-inventory-sanitized.json` has a new modification time.
4. Its `sources.account` property names the intended snapshot.

For the post-sale snapshot discussed on 2026-06-20, the expected gemstone totals are:

| Measure | Expected value |
|---|---:|
| Total gemstones | 197 |
| Socketed gemstones | 61 |
| Unsocketed gemstones | 136 |

These expected totals assume no gemstone changes occurred after the two completed selling tranches.

## Capture and Rebuild

The repository also includes a wrapper that opens a persistent browser session, waits for an account-shaped JSON response, saves the next numbered snapshot, and rebuilds relic and glyph outputs:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "C:\dev\rsl-codex-project\scripts\update-account-snapshot.ps1" -StartUrl "https://example.com/account-page"
```

To avoid putting a tokenized URL in shell history, put it in this ignored local file:

```text
C:\dev\rsl-codex-project\data-account-specific-dynamic\local-start-url.txt
```

Then run:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "C:\dev\rsl-codex-project\scripts\update-account-snapshot.ps1"
```

The browser profile is stored under `data-account-specific-dynamic\browser-profile` and is ignored by git because it may contain login state. On the first run, complete login in the opened browser; later runs can reuse the session while it remains valid. The wrapper defaults to the installed Chrome channel; pass `-BrowserChannel msedge` to use Edge instead.
