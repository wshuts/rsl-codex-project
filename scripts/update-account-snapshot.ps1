param(
    [Parameter(Mandatory = $true)]
    [string]$StartUrl,
    [string]$UrlPattern,
    [int]$TimeoutSeconds = 300,
    [string]$BrowserChannel = 'chrome',
    [string]$SnapshotDir,
    [string]$ProfileDir,
    [switch]$Headless,
    [switch]$SkipRebuild
)

$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$currentMarkerName = 'current-account-snapshot.txt'
if ([string]::IsNullOrWhiteSpace($SnapshotDir)) {
    $SnapshotDir = Join-Path $projectRoot 'data-account-specific-dynamic\snapshots'
}
if ([string]::IsNullOrWhiteSpace($ProfileDir)) {
    $ProfileDir = Join-Path $projectRoot 'data-account-specific-dynamic\browser-profile'
}

$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
$nodePath = if ($null -ne $nodeCommand) {
    $nodeCommand.Source
} else {
    'C:\Users\Bill\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
}

if (-not (Test-Path -LiteralPath $nodePath)) {
    throw "Node.js was not found on PATH or at the Codex bundled runtime path: $nodePath"
}

$bundledModules = 'C:\Users\Bill\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
if (Test-Path -LiteralPath $bundledModules) {
    $nodePathParts = @(
        $bundledModules,
        (Join-Path $bundledModules '.pnpm\playwright@1.60.0\node_modules'),
        (Join-Path $bundledModules '.pnpm\playwright-core@1.60.0\node_modules')
    )
    $env:NODE_PATH = ($nodePathParts -join [IO.Path]::PathSeparator)
}

$captureScript = Join-Path $PSScriptRoot 'capture-account-snapshot.mjs'
$captureArgs = @(
    $captureScript,
    '--start-url', $StartUrl,
    '--timeout-seconds', $TimeoutSeconds,
    '--browser-channel', $BrowserChannel,
    '--snapshot-dir', $SnapshotDir,
    '--profile-dir', $ProfileDir
)
if (-not [string]::IsNullOrWhiteSpace($UrlPattern)) {
    $captureArgs += @('--url-pattern', $UrlPattern)
}
if ($Headless) {
    $captureArgs += '--headless'
}

& $nodePath @captureArgs
if ($LASTEXITCODE -ne 0) {
    throw "Account snapshot capture failed with exit code $LASTEXITCODE."
}

function Resolve-CurrentAccountSnapshot {
    param([string]$Directory)

    $markerPath = Join-Path $Directory $currentMarkerName
    if (Test-Path -LiteralPath $markerPath) {
        $snapshotName = (Get-Content -Raw -LiteralPath $markerPath).Trim()
        if ($snapshotName -match '^account-response-\d{2}-private\.json$' -and
            [IO.Path]::GetFileName($snapshotName) -eq $snapshotName) {
            $candidatePath = Join-Path $Directory $snapshotName
            if (Test-Path -LiteralPath $candidatePath) {
                return (Resolve-Path -LiteralPath $candidatePath).Path
            }
        }
        Write-Warning "Ignoring stale or invalid current snapshot marker: $markerPath"
    }

    $snapshot = Get-ChildItem -LiteralPath $Directory -File |
        Where-Object { $_.Name -match '^account-response-\d{2}-private\.json$' } |
        Sort-Object -Property LastWriteTimeUtc, Name -Descending |
        Select-Object -First 1

    if ($null -eq $snapshot) {
        return $null
    }
    return $snapshot.FullName
}

$snapshotPath = Resolve-CurrentAccountSnapshot -Directory $SnapshotDir

if ($null -eq $snapshotPath) {
    throw "Capture completed, but no numbered account snapshot was found in $SnapshotDir."
}

Write-Host "Current account snapshot: $snapshotPath"

if (-not $SkipRebuild) {
    & (Join-Path $projectRoot 'relics\Relic Inventory\build-relic-inventory.ps1') -AccountPath $snapshotPath
    & (Join-Path $projectRoot 'glyphs\build-glyph-dashboard.ps1') -SnapshotPath $snapshotPath
    & (Join-Path $projectRoot 'glyphs\query-gear-glyph-progress.ps1') -SnapshotPath $snapshotPath
    & $nodePath (Join-Path $projectRoot 'glyphs\verify-glyph-dashboard.mjs')
    if ($LASTEXITCODE -ne 0) {
        throw "Glyph dashboard verification failed with exit code $LASTEXITCODE."
    }
}
