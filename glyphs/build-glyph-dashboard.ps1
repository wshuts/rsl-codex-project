$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$snapshotPath = Join-Path $projectRoot 'data-acount-specific-dynamic\snapshots\account-response-09-private.json'
$outputPath = Join-Path $PSScriptRoot 'generated\glyph-dashboard-data.js'
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $outputPath) | Out-Null
$data = Get-Content -Raw -LiteralPath $snapshotPath | ConvertFrom-Json

$artifactsById = @{}
foreach ($artifact in $data.artifacts) {
    $artifactsById[[string]$artifact.id] = $artifact
}

$heroTypesById = @{}
foreach ($heroType in $data.heroTypes) {
    $heroTypesById[[string]$heroType.id] = $heroType.name
}

$pieces = foreach ($hero in $data.heroes) {
    if ($null -eq $hero.artifacts) { continue }

    foreach ($artifactId in @($hero.artifacts)) {
        $artifact = $artifactsById[[string]$artifactId]
        $substats = foreach ($substat in @($artifact.secondaryBonuses)) {
            [ordered]@{
                kind = [int]$substat.kind
                value = [double]$substat.value
                absolute = [bool]$substat.isAbsolute
                enhancement = if ($substat.PSObject.Properties['enhancement']) { [double]$substat.enhancement } else { 0 }
                rollLevel = if ($substat.PSObject.Properties['level']) { [int]$substat.level } else { 0 }
            }
        }

        [ordered]@{
            champion = $heroTypesById[[string]$hero.typeId]
            heroId = [int]$hero.id
            artifactId = [int]$artifact.id
            gearKind = [int]$artifact.kind
            setCode = [int]$artifact.set
            rank = [int]$artifact.rank
            rarity = [int]$artifact.rarity
            level = [int]$artifact.level
            substats = @($substats)
        }
    }
}

$payload = [ordered]@{
    source = Split-Path -Leaf $snapshotPath
    sourceModified = (Get-Item -LiteralPath $snapshotPath).LastWriteTime.ToString('o')
    generated = (Get-Date).ToString('o')
    pieces = @($pieces)
}

$json = $payload | ConvertTo-Json -Depth 8 -Compress
Set-Content -LiteralPath $outputPath -Encoding utf8 -Value "window.GLYPH_DATA=$json;"

[pscustomobject]@{ Pieces = @($pieces).Count; Output = $outputPath }
