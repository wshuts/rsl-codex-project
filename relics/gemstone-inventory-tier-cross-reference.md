# Gemstone Inventory Tier Cross-Reference

## Scope

- Inventory source: `Relic Inventory/relic-inventory-sanitized.json`
- Inventory snapshot generated: 2026-06-20
- Tier sources: HellHades and Ayumilove community tier lists
- Result: Both community sources assign all 80 gemstones to identical tiers.
- Inventory totals: 258 gemstones, comprising 197 available and 61 socketed copies.

Tier placement is a general measure of value. Champion synergy, relic effects, socket shape, and removal cost should still be checked before socketing or removing a gemstone.

## Inventory by Consensus Tier

| Tier | Total copies | Available | Socketed | Types owned | Types in tier | Available sale value |
|---|---:|---:|---:|---:|---:|---:|
| SS | 7 | 7 | 0 | 5 | 11 | 1,120 |
| S | 42 | 28 | 14 | 8 | 15 | 1,040 |
| A | 62 | 46 | 16 | 17 | 26 | 1,940 |
| B | 109 | 80 | 29 | 17 | 20 | 1,960 |
| C | 38 | 36 | 2 | 8 | 8 | 760 |
| **Total** | **258** | **197** | **61** | **55** | **80** | **6,820** |

## Highest-Priority Available Gemstones

### SS Tier

| Gemstone | Rarity | Shape | Available |
|---|---|---|---:|
| Boss Slayer | Mythical | Circle | 2 |
| Necrodefense | Mythical | Diamond | 2 |
| Bloodthirsty Prowess | Mythical | Circle | 1 |
| Bolstered Defense | Mythical | Circle | 1 |
| Caught Unaware | Mythical | Diamond | 1 |

All seven owned SS-tier gemstones are currently available rather than socketed. Reserve them for deliberate champion and relic matches instead of filling sockets opportunistically.

### S Tier With Available Copies

| Gemstone | Rarity | Shape | Available | Socketed | Total |
|---|---|---|---:|---:|---:|
| Invigorated | Rare | Circle | 13 | 9 | 22 |
| Pierce Defenses | Rare | Triangle | 7 | 2 | 9 |
| Explosive Power | Legendary | Circle | 4 | 0 | 4 |
| Puppetmaster | Legendary | Circle | 2 | 1 | 3 |
| Expeditious Exploitation | Legendary | Diamond | 1 | 0 | 1 |
| Rolling Force | Legendary | Triangle | 1 | 0 | 1 |

## Constrained High-Tier Inventory

These owned S-tier gemstones have no available spare copies:

| Gemstone | Rarity | Shape | Available | Socketed |
|---|---|---|---:|---:|
| Piercing Strike | Legendary | Triangle | 0 | 1 |
| Uncontrollable | Legendary | Circle | 0 | 1 |

Uncontrollable is particularly constrained because the existing copy is socketed and prior HellHades guidance calls for two copies on Aspect of Siroth. Acquiring or crafting another copy is preferable to moving the current one without first checking its deployment and removal cost.

## Missing SS-Tier Gemstones

The inventory contains no copies of:

- Gathering Momentum
- Speedy Willpower
- Heal N Go
- Revival's Boon
- Skillmaster
- Impede Them

These are the strongest acquisition or crafting gaps according to both community lists, subject to the account's champion and relic needs.

## Socketed C-Tier Review Cases

Only two C-tier gemstones are currently socketed:

| Gemstone | Gem ID | Relic | Relic ID | Wearer | Effect |
|---|---:|---|---:|---|---|
| Enhanced Shot | 15 | Wand of Submission | 4 | Embrys the Anomaly | Increases ACC by 3 for each buff on the wearer. |
| Weak Retort | 88 | Aspect of Siroth | 119 | Goffred Brassclad | Reduces damage received from counterattacks by 15%. |

These are the clearest candidates for an upgrade review, but tier alone is not sufficient reason to remove them. Validate champion synergy, replacement shape, and non-destructive removal cost first.

## Starstone Sale Candidates

### Sale Yields

| Rarity | Starstones per gemstone |
|---|---:|
| Rare | 20 |
| Epic | 40 |
| Legendary | 80 |
| Mythical | 160 |

The largest available lower-tier holdings are:

| Gemstone | Tier | Available | Total |
|---|---|---:|---:|
| Unerring Focus | C | 21 | 21 |
| Critical Bolster | B | 20 | 25 |
| Unstoppable | B | 14 | 17 |
| Shieldbreaker | B | 9 | 9 |
| Embellished Shield | B | 7 | 9 |
| Unflinching | B | 7 | 9 |

Selling every currently available gemstone would generate 6,820 Starstones, but that figure includes valuable A-, S-, and SS-tier inventory and is not a recommended liquidation plan. The available B- and C-tier inventory represents up to 2,720 Starstones. Treat those abundant lower-tier holdings as the first sale candidates when Starstones are needed, while retaining enough copies for known niche applications.

## Recommended Actions

1. Match the seven available SS-tier gemstones to champions and compatible high-value relics before committing them.
2. Preserve the only copies of Piercing Strike and Uncontrollable unless a clearly superior deployment is identified.
3. Prioritize acquisition or crafting of the six missing SS-tier types, weighted by current champion and relic needs.
4. Review Enhanced Shot on Embrys and Weak Retort on Goffred for possible upgrades after checking removal costs.
5. Sell surplus B- and C-tier copies first when generating Starstones, rather than selling scarce A-, S-, or SS-tier gemstones.

## Reproduction

Run `gemstone-inventory-tier-analysis.js` to regenerate the tier counts and per-gemstone inventory cross-reference from the current sanitized inventory snapshot and HellHades tier-list DOM excerpt.
