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

$snapshot = Get-ChildItem -LiteralPath $SnapshotDir -File |
    Where-Object { $_.Name -match '^account-response-(\d+)-private\.json$' } |
    ForEach-Object { [pscustomobject]@{ File = $_; Number = [int]$Matches[1] } } |
    Sort-Object Number -Descending |
    Select-Object -First 1

if ($null -eq $snapshot) {
    throw "Capture completed, but no numbered account snapshot was found in $SnapshotDir."
}

Write-Host "Newest account snapshot: $($snapshot.File.FullName)"

if (-not $SkipRebuild) {
    & (Join-Path $projectRoot 'relics\Relic Inventory\build-relic-inventory.ps1') -AccountPath $snapshot.File.FullName
    & (Join-Path $projectRoot 'glyphs\build-glyph-dashboard.ps1') -SnapshotPath $snapshot.File.FullName
    & (Join-Path $projectRoot 'glyphs\query-gear-glyph-progress.ps1') -SnapshotPath $snapshot.File.FullName
    & $nodePath (Join-Path $projectRoot 'glyphs\verify-glyph-dashboard.mjs')
    if ($LASTEXITCODE -ne 0) {
        throw "Glyph dashboard verification failed with exit code $LASTEXITCODE."
    }
}
