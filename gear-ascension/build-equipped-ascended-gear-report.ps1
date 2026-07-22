param(
    [string]$SnapshotPath
)

$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$snapshotDirectory = Join-Path $projectRoot 'data-account-specific-dynamic\snapshots'
$currentMarkerName = 'current-account-snapshot.txt'

if ([string]::IsNullOrWhiteSpace($SnapshotPath)) {
    $markerPath = Join-Path $snapshotDirectory $currentMarkerName
    if (Test-Path -LiteralPath $markerPath) {
        $snapshotName = (Get-Content -Raw -LiteralPath $markerPath).Trim()
        if ($snapshotName -match '^account-response-\d{2}-private\.json$' -and
            [IO.Path]::GetFileName($snapshotName) -eq $snapshotName) {
            $candidatePath = Join-Path $snapshotDirectory $snapshotName
            if (Test-Path -LiteralPath $candidatePath) {
                $SnapshotPath = $candidatePath
            }
        }
        if ([string]::IsNullOrWhiteSpace($SnapshotPath)) {
            Write-Warning "Ignoring stale or invalid current snapshot marker: $markerPath"
        }
    }

    if ([string]::IsNullOrWhiteSpace($SnapshotPath)) {
        $snapshot = Get-ChildItem -LiteralPath $snapshotDirectory -File |
            Where-Object { $_.Name -match '^account-response-\d{2}-private\.json$' } |
            Sort-Object -Property LastWriteTimeUtc, Name -Descending |
            Select-Object -First 1

        if ($null -eq $snapshot) {
            throw "No numbered account snapshot was found in $snapshotDirectory."
        }
        $SnapshotPath = $snapshot.FullName
    }
}

$snapshotPath = (Resolve-Path -LiteralPath $SnapshotPath).Path
$outputPath = Join-Path $PSScriptRoot 'generated\equipped-ascended-gear-stats.csv'
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $outputPath) | Out-Null

$data = Get-Content -Raw -LiteralPath $snapshotPath | ConvertFrom-Json
Write-Host "Using account snapshot: $(Split-Path -Leaf $snapshotPath)"

$slotNames = @{
    1 = 'Helmet'
    2 = 'Chest'
    3 = 'Gloves'
    4 = 'Boots'
    5 = 'Weapon'
    6 = 'Shield'
    7 = 'Ring'
    8 = 'Amulet'
    9 = 'Banner'
}

$statNames = @{
    1 = 'HP'
    2 = 'ATK'
    3 = 'DEF'
    4 = 'SPD'
    5 = 'RES'
    6 = 'ACC'
    7 = 'C.RATE'
    8 = 'C.DMG'
}

function Format-GearStat {
    param($Bonus)

    if ($null -eq $Bonus) {
        return ''
    }

    $name = $statNames[[int]$Bonus.kind]
    if ([string]::IsNullOrWhiteSpace($name)) {
        return "Unknown($($Bonus.kind))"
    }

    $isAbsolute = $false
    if ($Bonus.PSObject.Properties['isAbsolute']) {
        $isAbsolute = [bool]$Bonus.isAbsolute
    }

    if ([int]$Bonus.kind -in 1, 2, 3 -and -not $isAbsolute) {
        return "$name%"
    }

    return $name
}

$artifactsById = @{}
foreach ($artifact in $data.artifacts) {
    $artifactsById[[string]$artifact.id] = $artifact
}

$heroTypesById = @{}
foreach ($heroType in $data.heroTypes) {
    $heroTypesById[[string]$heroType.id] = $heroType.name
}

$rows = foreach ($hero in $data.heroes) {
    if ($null -eq $hero.artifacts) { continue }

    foreach ($artifactId in @($hero.artifacts)) {
        if ($null -eq $artifactId) { continue }

        $artifact = $artifactsById[[string]$artifactId]
        if ($null -eq $artifact) { continue }
        if (-not $artifact.PSObject.Properties['ascendLevel'] -or [int]$artifact.ascendLevel -le 0) { continue }

        [pscustomobject]@{
            Champion = $heroTypesById[[string]$hero.typeId]
            HeroId = [int]$hero.id
            ArtifactId = [int]$artifact.id
            Slot = $slotNames[[int]$artifact.kind]
            PrimaryStat = Format-GearStat $artifact.primaryBonus
            AscendedStat = Format-GearStat $artifact.ascendBonus
            AscensionLevel = [int]$artifact.ascendLevel
            Rank = [int]$artifact.rank
            Rarity = [int]$artifact.rarity
            Level = if ($artifact.PSObject.Properties['level']) { [int]$artifact.level } else { 0 }
            SetCode = [int]$artifact.set
        }
    }
}

$rows |
    Sort-Object Champion, HeroId, Slot, ArtifactId |
    Export-Csv -NoTypeInformation -Encoding utf8 -LiteralPath $outputPath

[pscustomobject]@{
    Snapshot = Split-Path -Leaf $snapshotPath
    Rows = @($rows).Count
    Output = $outputPath
}
