$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$snapshotPath = Join-Path $projectRoot 'data-acount-specific-dynamic\snapshots\account-response-09-private.json'
$outputPath = Join-Path $PSScriptRoot 'generated\gear-glyph-progress.csv'
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $outputPath) | Out-Null
$data = Get-Content -Raw -LiteralPath $snapshotPath | ConvertFrom-Json
$speedTunedHeroIds = @(14940, 16279, 18270, 19828, 10289)

$artifactsById = @{}
foreach ($artifact in $data.artifacts) {
    $artifactsById[[string]$artifact.id] = $artifact
}

$heroTypesById = @{}
foreach ($heroType in $data.heroTypes) {
    $heroTypesById[[string]$heroType.id] = $heroType.name
}

$results = foreach ($hero in $data.heroes) {
    if ($null -eq $hero.artifacts) {
        continue
    }

    foreach ($artifactId in @($hero.artifacts)) {
        $artifact = $artifactsById[[string]$artifactId]
        $eligibleSubstats = @($artifact.secondaryBonuses | Where-Object { $_.kind -notin 7, 8 })
        $protectedSpeedSubstats = @($eligibleSubstats | Where-Object {
            $hero.id -in $speedTunedHeroIds -and $_.kind -eq 4
        })
        $missingSubstats = @($eligibleSubstats | Where-Object {
            -not ($hero.id -in $speedTunedHeroIds -and $_.kind -eq 4) -and
            (-not $_.PSObject.Properties['enhancement'] -or [double]$_.enhancement -eq 0)
        })

        if ($missingSubstats.Count -gt 0) {
            [pscustomobject]@{
                Champion             = $heroTypesById[[string]$hero.typeId]
                HeroId               = $hero.id
                ArtifactId           = $artifact.id
                GearKindCode         = $artifact.kind
                Rank                 = $artifact.rank
                RarityCode           = $artifact.rarity
                Level                = $artifact.level
                EligibleSubstats     = $eligibleSubstats.Count
                ProtectedSpeedStats  = $protectedSpeedSubstats.Count
                MissingGlyphs        = $missingSubstats.Count
                MissingSubstatCodes  = ($missingSubstats.kind -join '|')
            }
        }
    }
}

$results |
    Sort-Object Champion, HeroId, GearKindCode, ArtifactId |
    Export-Csv -NoTypeInformation -Encoding utf8 -LiteralPath $outputPath

[pscustomobject]@{
    Snapshot = Split-Path -Leaf $snapshotPath
    Rows = @($results).Count
    Output = $outputPath
}
