param(
    [string]$AccountPath,
    [string]$StaticPath = "$PSScriptRoot\relic-static-data.json",
    [string]$OutputPath = "$PSScriptRoot\relic-inventory-sanitized.json"
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$snapshotDirectory = Join-Path $projectRoot "data-account-specific-dynamic\snapshots"
$currentMarkerName = "current-account-snapshot.txt"

if ([string]::IsNullOrWhiteSpace($AccountPath)) {
    $markerPath = Join-Path $snapshotDirectory $currentMarkerName
    if (Test-Path -LiteralPath $markerPath) {
        $snapshotName = (Get-Content -Raw -LiteralPath $markerPath).Trim()
        if ($snapshotName -match '^account-response-\d{2}-private\.json$' -and
            [IO.Path]::GetFileName($snapshotName) -eq $snapshotName) {
            $candidatePath = Join-Path $snapshotDirectory $snapshotName
            if (Test-Path -LiteralPath $candidatePath) {
                $AccountPath = $candidatePath
            }
        }
        if ([string]::IsNullOrWhiteSpace($AccountPath)) {
            Write-Warning "Ignoring stale or invalid current snapshot marker: $markerPath"
        }
    }

    if ([string]::IsNullOrWhiteSpace($AccountPath)) {
        $accountSnapshot = Get-ChildItem -LiteralPath $snapshotDirectory -File |
            Where-Object { $_.Name -match '^account-response-\d{2}-private\.json$' } |
            Sort-Object -Property LastWriteTimeUtc, Name -Descending |
            Select-Object -First 1

        if ($null -eq $accountSnapshot) {
            throw "No numbered account snapshot matching account-response-<00-99>-private.json was found in $snapshotDirectory."
        }

        $AccountPath = $accountSnapshot.FullName
    }
}

$AccountPath = (Resolve-Path -LiteralPath $AccountPath).Path
$StaticPath = (Resolve-Path -LiteralPath $StaticPath).Path

Write-Host "Using account snapshot: $(Split-Path -Leaf $AccountPath)"

$account = Get-Content -Raw -LiteralPath $AccountPath | ConvertFrom-Json
$static = Get-Content -Raw -LiteralPath $StaticPath | ConvertFrom-Json

$rarityNames = @{
    3 = "Rare"
    4 = "Epic"
    5 = "Legendary"
    6 = "Mythical"
}

$statNames = @{
    1 = "Health"
    2 = "Attack"
    3 = "Defense"
    4 = "Speed"
    5 = "Resistance"
    6 = "Accuracy"
    8 = "CriticalDamage"
}

$relicTypesById = @{}
foreach ($type in $static.relicTypes) {
    $relicTypesById[[int]$type.id] = $type
}

$stoneTypesById = @{}
foreach ($type in $static.relicStoneTypes) {
    $stoneTypesById[[int]$type.id] = $type
}

$stonesById = @{}
foreach ($stone in $account.relicStones) {
    $stonesById[[int]$stone.id] = $stone
}

$heroTypesById = @{}
foreach ($type in $account.heroTypes) {
    $heroTypesById[[int]$type.id] = $type
}

$relicOwners = @{}
foreach ($hero in $account.heroes) {
    foreach ($relicId in @($hero.relics)) {
        if ($null -ne $relicId) {
            $relicOwners[[int]$relicId] = $hero
        }
    }
}

$stoneLocations = @{}
foreach ($relic in $account.relics) {
    for ($slotIndex = 0; $slotIndex -lt $relic.sockets.Count; $slotIndex++) {
        $socket = $relic.sockets[$slotIndex]
        if ($null -ne $socket.stoneId) {
            $stoneLocations[[int]$socket.stoneId] = [ordered]@{
                relicId = [int]$relic.id
                slot = $slotIndex + 1
                shapeId = [int]$socket.shapeKindId
            }
        }
    }
}

function Get-CalculatedStat {
    param(
        [int]$StatId,
        [int]$SlotIndex,
        [int]$Level
    )

    $statName = $statNames[$StatId]
    $openingLevel = [int]$static.statBonusOpeningLevels[$SlotIndex]
    $unlocked = $Level -ge $openingLevel
    $table = $static.statValueByLevel.$statName
    # Each stat starts its own progression when its slot unlocks. For example,
    # a Speed stat opening at +9 uses the level-0 Speed value at relic +9.
    $effectiveLevel = [Math]::Max(0, $Level - $openingLevel)
    $entry = $table[$effectiveLevel]

    [ordered]@{
        slot = $SlotIndex + 1
        statId = $StatId
        name = $statName
        openingLevel = $openingLevel
        unlocked = $unlocked
        value = if ($unlocked) { [double]$entry.value } else { 0 }
        isAbsolute = [bool]$entry.isAbsolute
    }
}

$joinedRelics = foreach ($relic in $account.relics) {
    $type = $relicTypesById[[int]$relic.typeId]
    if ($null -eq $type) {
        throw "Missing static relic type $($relic.typeId)."
    }

    $rarityId = [int]$type.rarity
    $owner = $relicOwners[[int]$relic.id]
    $ownerType = if ($null -ne $owner) {
        $heroTypesById[[int]$owner.typeId]
    } else {
        $null
    }

    $stats = for ($index = 0; $index -lt $type.statsBonus.Count; $index++) {
        Get-CalculatedStat `
            -StatId ([int]$type.statsBonus[$index]) `
            -SlotIndex $index `
            -Level ([int]$relic.level)
    }

    $sockets = for ($index = 0; $index -lt $relic.sockets.Count; $index++) {
        $socket = $relic.sockets[$index]
        $stone = if ($null -ne $socket.stoneId) {
            $stonesById[[int]$socket.stoneId]
        } else {
            $null
        }
        $stoneType = if ($null -ne $stone) {
            $stoneTypesById[[int]$stone.typeId]
        } else {
            $null
        }

        [ordered]@{
            slot = $index + 1
            shapeId = [int]$socket.shapeKindId
            stone = if ($null -ne $stone) {
                [ordered]@{
                    id = [int]$stone.id
                    typeId = [int]$stone.typeId
                    name = $stoneType.name
                    description = $stoneType.description
                    rarityId = [int]$stoneType.rarity
                    rarity = $rarityNames[[int]$stoneType.rarity]
                    shapeId = [int]$stoneType.shape
                    shapeMatchesSocket = `
                        [int]$stoneType.shape -eq [int]$socket.shapeKindId
                }
            } else {
                $null
            }
        }
    }

    [ordered]@{
        id = [int]$relic.id
        typeId = [int]$relic.typeId
        name = $type.name
        description = $type.description
        groupId = [int]$type.group
        rarityId = $rarityId
        rarity = $rarityNames[$rarityId]
        rank = [int]$relic.rank
        level = [int]$relic.level
        maxLevel = [int]$static.maxRelicLevelByRank.PSObject.Properties["$($relic.rank)"].Value
        baseRankForRarity = `
            [int]$static.basicRelicRankByRarity.PSObject.Properties["$rarityId"].Value
        seen = [bool]$relic.isSeen
        activationState = $relic.isActivated
        equipped = $null -ne $owner
        wearer = if ($null -ne $owner) {
            [ordered]@{
                heroId = [int]$owner.id
                heroTypeId = [int]$owner.typeId
                name = $ownerType.name
                shortName = $ownerType.shortName
            }
        } else {
            $null
        }
        stats = @($stats)
        sockets = @($sockets)
        skillIds = @($type.skillIds)
        skillLevelDescriptions = @($type.skillLevelDescriptions)
    }
}

$joinedStones = foreach ($stone in $account.relicStones) {
    $type = $stoneTypesById[[int]$stone.typeId]
    if ($null -eq $type) {
        throw "Missing static gemstone type $($stone.typeId)."
    }

    $location = $stoneLocations[[int]$stone.id]

    [ordered]@{
        id = [int]$stone.id
        typeId = [int]$stone.typeId
        name = $type.name
        description = $type.description
        rarityId = [int]$type.rarity
        rarity = $rarityNames[[int]$type.rarity]
        shapeId = [int]$type.shape
        socketed = $null -ne $location
        socketedIn = $location
        skillIds = @($type.skillIds)
    }
}

$equippedCount = @($joinedRelics | Where-Object equipped).Count
$socketedStoneCount = @($joinedStones | Where-Object socketed).Count

$output = [ordered]@{
    schemaVersion = 1
    generatedAt = (Get-Date).ToUniversalTime().ToString("o")
    sources = [ordered]@{
        account = Split-Path -Leaf $AccountPath
        staticData = Split-Path -Leaf $StaticPath
    }
    summary = [ordered]@{
        relics = $joinedRelics.Count
        equippedRelics = $equippedCount
        unequippedRelics = $joinedRelics.Count - $equippedCount
        gemstones = $joinedStones.Count
        socketedGemstones = $socketedStoneCount
        unsocketedGemstones = $joinedStones.Count - $socketedStoneCount
    }
    relics = @($joinedRelics)
    gemstones = @($joinedStones)
}

$json = $output | ConvertTo-Json -Depth 20
Set-Content -LiteralPath $OutputPath -Value $json -Encoding UTF8

Write-Host "Wrote $($joinedRelics.Count) relics and $($joinedStones.Count) gemstones to $OutputPath"
