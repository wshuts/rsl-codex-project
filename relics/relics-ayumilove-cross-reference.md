# Ayumilove Relic Tier Cross-Reference

## Scope

- Inventory snapshot: `relic-inventory-sanitized.json`, generated 2026-06-19 22:36:05 UTC
- Account source: `account-response-05-private.json`
- Inventory size: 120 relics (20 equipped, 100 unequipped)
- Gemstone inventory: 258 gemstones (61 socketed, 197 unsocketed)
- Tier source: `Ayumilove/relic-tier-list.txt`
- Match result: 120 of 120 relics matched

## Method and Limits

Ayumilove describes the tier list as a resource-prioritization guide, not a strict keep-or-feed rule. Rankings consider passive effects, stat scaling, gemstone-slot configuration, and practical champion performance. They are situational and depend on champion synergy, game mode, build direction, and gemstone optimization.

Most importantly, Ayumilove compares relics **within the same rarity**. A tier letter should not be used by itself to conclude that a Rare relic is stronger or weaker than an Epic, Legendary, or Mythical relic in another tier.

This report therefore separates four different judgments:

1. **Tier rating** - Ayumilove's broad rating within the relic's rarity.
2. **Authoritative Food rule** - a deterministic account-owner decision that overrides external guidance.
3. **Default disposition** - the account-management starting point for relics without an authoritative rule: preserve, evaluate, or fodder-leaning.
4. **Specific exceptions** - champion synergy, content, gemstone slots, current investment, and equipped use that can override a tier-derived default, but not an authoritative Food rule.

Only Draught of Ire currently has relic-specific Ayumilove guidance in the local source material. Other dispositions remain tier-derived defaults until their individual guides are added.

## Tier Distribution

| Ayumilove Tier | Total | Equipped | Unequipped |
|---|---:|---:|---:|
| SS | 2 | 1 | 1 |
| S | 14 | 5 | 9 |
| A | 24 | 6 | 18 |
| B | 37 | 5 | 32 |
| C | 35 | 3 | 32 |
| F | 8 | 0 | 8 |
| **Total** | **120** | **20** | **100** |

These totals are an inventory overview, not a cross-rarity power comparison.

## Authoritative Food Policy

The account owner has declared the following ten Rare relic types to be **Food for all current and future copies**. This is authoritative truth for the account workflow. It overrides Ayumilove tiers, relic-specific guidance, niche synergy, rank, level, and prior investment. Only an explicit future account-owner decision may amend the list or create an exception.

| Relic | Ayumilove Tier | Current Copies | Rule |
|---|---:|---:|---|
| Mask of Rage | F | 1 | Food |
| Unholy Grail | F | 2 | Food |
| Rod of Blasphemy | F | 2 | Food |
| Diadem of Undeath | F | 1 | Food |
| Tempus Morbidia | F | 0 | Food for future copies |
| Jaws of Hatred | F | 0 | Food for future copies |
| The Fleshrender | F | 1 | Food |
| Blackshroud Fan | F | 1 | Food |
| Royal Digit | F | 0 | Food for future copies |
| Draught of Ire | B | 1 | Food |

Current snapshot: 9 copies across 7 listed types. All 9 are unequipped, have no socketed gemstones, and meet the food-level minimum recorded in `relics-food.txt`.

The rule reflects the account's transition from mid-game toward late-game, the relative availability of Rare relics through crafting, and the lower cost of correcting Rare-relic experimentation errors.

## Disposition Framework

| Disposition | Meaning |
|---|---|
| Food | Authoritative account-owner classification. No relic-value, tier, or synergy reevaluation is required. |
| Preserve | Strong default to retain; prioritize the best copies for upgrades, champion matching, and gemstone review. Not an unconditional keep rule. |
| Evaluate | Retain only when a credible champion, content, stat, or gemstone use exists; compare duplicate copies before investing. |
| Fodder-leaning | Default candidate for relic experience, but pause for equipped use, strong synergy, valuable slots or gemstones, and meaningful prior investment. |

### Account-Level Defaults

- **Strong preserve default:** 28 unequipped SS/S/A relics. Preserve first, then assess duplicates and account fit rather than treating the tier as absolute.
- **Evaluate:** 32 unequipped B-tier relics. Require a credible niche, champion, content, stat, or gemstone case before further investment.
- **Fodder-leaning with exceptions:** 32 unequipped C-tier relics. These remain advisory candidates, not declared Food.
- **Authoritative Food:** all 8 current F-tier copies plus the B-tier Draught of Ire. Their Food status comes from the owner policy, not from their tier letters.
- No F-tier relic is currently equipped.
- Three C-tier relics are equipped: Hatter's Reserve on Arix and Demonic Effigy on Melga Steelgirdle and Rector Drath. These are the first equipped placements to reconsider when a suitable higher-tier alternative is available.

## Relic-Specific Guidance

### Draught of Ire

| Field | Account Finding |
|---|---|
| Ayumilove tier | B, evaluated against other Rare relics |
| Ayumilove default | Mainly fodder for stronger relics |
| Niche exception | A1-focused damage dealers, especially champions whose default attacks interact well with ally attacks or counterattacks |
| Example champions from Ayumilove | Cupidus, Khoronar, Kro'khad the Throatripper |
| Example champions found in roster reference | None |
| Owned copy | ID 307; Rare; Rank 4; +9 of +12; unequipped |
| Current stats | 3,185 HP and 204 ATK unlocked; ACC remains locked at this rank/level |
| Gemstone state | One empty Circle socket |
| Account disposition | **Food - authoritative account-owner rule** |

Ayumilove's niche guidance is retained as explanatory background, but it does not reopen the account decision. This Rank 4 +9 copy already meets the Rank 4 food minimum of +9 and remains Food.

## Highest-Priority Unequipped Relics

| Tier | Relic | Unequipped Copies | Best Unequipped Copy |
|---|---|---:|---|
| SS | Wand of Submission | 1 | Rank 3, +0 |
| S | Golden Elixir | 8 | Rank 3, +9 |
| S | Irethi Coronet | 1 | Rank 3, +9 |
| A | Aspect of Siroth | 2 | Rank 3, +0 |
| A | Journal of Necrotos | 7 | Rank 2, +6 |
| A | Molten Deathbell | 3 | Rank 2, +6 |
| A | Scroll of the Unseen | 6 | Rank 3, +9 |

Gorecrescent, Last Laugh Amulet, and Soulmar Crystal are also high-tier, but their only owned copies are already equipped.

## Full Inventory Cross-Reference

| Tier | Rarity | Relic | Default Disposition | Total | Equipped | Unequipped | Best Unequipped |
|---|---|---|---|---:|---:|---:|---|
| SS | Legendary | Wand of Submission | Preserve | 2 | 1 | 1 | Rank 3, +0 |
| S | Epic | Golden Elixir | Preserve | 12 | 4 | 8 | Rank 3, +9 |
| S | Legendary | Gorecrescent | Preserve | 1 | 1 | 0 | n/a |
| S | Epic | Irethi Coronet | Preserve | 1 | 0 | 1 | Rank 3, +9 |
| A | Legendary | Aspect of Siroth | Preserve | 4 | 2 | 2 | Rank 3, +0 |
| A | Rare | Journal of Necrotos | Preserve | 7 | 0 | 7 | Rank 2, +6 |
| A | Legendary | Last Laugh Amulet | Preserve | 1 | 1 | 0 | n/a |
| A | Rare | Molten Deathbell | Preserve | 5 | 2 | 3 | Rank 2, +6 |
| A | Epic | Scroll of the Unseen | Preserve | 6 | 0 | 6 | Rank 3, +9 |
| A | Legendary | Soulmar Crystal | Preserve | 1 | 1 | 0 | n/a |
| B | Epic | Compass of Anaxia | Evaluate | 2 | 0 | 2 | Rank 2, +0 |
| B | Epic | Darksmile's Toast | Evaluate | 1 | 1 | 0 | n/a |
| B | Rare | Draught of Ire | Food - authoritative | 1 | 0 | 1 | Rank 4, +9 |
| B | Epic | Exuzar's Totem | Evaluate | 2 | 1 | 1 | Rank 3, +9 |
| B | Epic | Gilded Dragonstone | Evaluate | 9 | 1 | 8 | Rank 3, +9 |
| B | Epic | Howling Guardians | Evaluate | 2 | 0 | 2 | Rank 2, +0 |
| B | Rare | Malefic Talon | Evaluate | 7 | 1 | 6 | Rank 2, +6 |
| B | Epic | Orb of Transfixion | Evaluate | 3 | 1 | 2 | Rank 3, +9 |
| B | Epic | Preserved Aberration | Evaluate | 1 | 0 | 1 | Rank 2, +0 |
| B | Rare | Tempus Sanguinis | Evaluate | 9 | 0 | 9 | Rank 2, +6 |
| C | Epic | Demonic Effigy | Fodder-leaning; equipped exception | 8 | 2 | 6 | Rank 3, +9 |
| C | Epic | Hatter's Reserve | Fodder-leaning; equipped exception | 2 | 1 | 1 | Rank 2, +0 |
| C | Rare | Hoarder's Cauldron | Fodder-leaning | 10 | 0 | 10 | Rank 1, +0 |
| C | Epic | Revolting Seedling | Fodder-leaning; developed-copy review | 4 | 0 | 4 | Rank 3, +9 |
| C | Rare | Sigil of the Akar | Fodder-leaning | 1 | 0 | 1 | Rank 2, +6 |
| C | Rare | Sinner's Cloak | Fodder-leaning | 1 | 0 | 1 | Rank 1, +0 |
| C | Rare | Steel-Eyed Cutter | Fodder-leaning | 6 | 0 | 6 | Rank 2, +6 |
| C | Rare | Thunderous Circlet | Fodder-leaning | 1 | 0 | 1 | Rank 2, +6 |
| C | Epic | Valkanen's Grasp | Fodder-leaning; developed-copy review | 1 | 0 | 1 | Rank 3, +9 |
| C | Rare | Vigor Mortis | Fodder-leaning | 1 | 0 | 1 | Rank 1, +0 |
| F | Rare | Blackshroud Fan | Food - authoritative | 1 | 0 | 1 | Rank 4, +9 |
| F | Rare | Diadem of Undeath | Food - authoritative | 1 | 0 | 1 | Rank 5, +12 |
| F | Rare | Mask of Rage | Food - authoritative | 1 | 0 | 1 | Rank 4, +12 |
| F | Rare | Rod of Blasphemy | Food - authoritative | 2 | 0 | 2 | Rank 4, +12 |
| F | Rare | The Fleshrender | Food - authoritative | 1 | 0 | 1 | Rank 5, +12 |
| F | Rare | Unholy Grail | Food - authoritative | 2 | 0 | 2 | Rank 5, +15 |

## Equipped Tier Profile

| Tier | Equipped Relics and Wearers |
|---|---|
| SS | Wand of Submission - Embrys the Anomaly |
| S | Gorecrescent - Vestele Riverthorn; Golden Elixir - Leminisi, Coldheart, Yakarl, Whisper |
| A | Aspect of Siroth - Goffred Brassclad, Firrol the Barkhorn; Soulmar Crystal - Elva Autumnborn; Last Laugh Amulet - Basher; Molten Deathbell - Madame Serris, Criodan the Blue |
| B | Malefic Talon - Sun Wukong; Darksmile's Toast - Sulfuryion; Exuzar's Totem - Lamasu; Orb of Transfixion - Warlord; Gilded Dragonstone - Freyja Fateweaver |
| C | Hatter's Reserve - Arix; Demonic Effigy - Melga Steelgirdle, Rector Drath |
| F | None |

## Name Normalization

The following inventory names were treated as equivalent to the Ayumilove spelling:

- The inventory's mojibake spelling of `Exuzar's Totem` was normalized to the tier-list spelling.
- `Hoarder's Cauldron` was matched to the tier list's singular possessive spelling.
- `Sinners' Cloak` was matched to the tier list's `Sinner's Cloak` spelling.

## Food Precedence

Ayumilove tier is a broad relic-effect rating, not an account command. For the ten owner-declared Food types, rank, level, investment, and niche-use guidance do not trigger relic-value reevaluation. The developed levels of the nine current copies reflect the food-preparation workflow and are not reasons to reverse their classification.
