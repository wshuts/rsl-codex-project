# Relic Deployment Shortlist

## Scope

This is the active deployment working set: the **28 relic copies rated SS, S, or A that were unequipped at the initial snapshot**. Freyja's deployment has since reduced the unequipped remainder to 27.

- This is a copy-level list. Relic IDs are the authoritative identifiers.
- Preserve is the starting disposition, not an instruction to equip or upgrade.
- Relics outside this list are out of scope for the current deployment pass.
- Current inventory source: `Relic Inventory/relic-inventory-sanitized.json`, regenerated from account snapshot 06 on 2026-06-20 01:07:54 UTC.

## Speed and Turn-Order Gate

Before equipping, upgrading, or socketing any shortlisted relic, record and review:

1. The proposed champion's current displayed SPD.
2. Every team and mode in which the champion is used.
3. The champion's required turn order or speed tune and its permitted variance.
4. The relic's currently active stats and every stat that will unlock at later levels.
5. Every currently socketed gemstone effect and every proposed gemstone effect.
6. The projected displayed SPD after the complete intended relic upgrade.
7. Conditional SPD, Turn Meter gain, and Turn Meter amplification or reduction effects, even when displayed SPD does not change.
8. A restoration plan for the previous relic and gemstone state.

An unknown in any applicable field means **hold: do not equip, upgrade, or socket**. A change is approved only after the complete final state—not merely the relic's present level—has been shown safe for every known team.

## Displayed-Effect Interpretation Safeguard

Relic thumbnail and static-data descriptions appear to show the Ability Level 1 effect and may omit enhancements unlocked at the owned copy's current relic level. Do not treat the headline percentage as the complete current-state value.

For every proposed deployment, distinguish:

- the displayed Ability Level 1 effect;
- the owned copy's current rank and level;
- the ability progression attached to relic-level thresholds; and
- the current effective value, confirmed in-game when the account export does not expose it.

Aspect of Siroth is the first detailed case. Both the Rank 3/+0 and Rank 3/+9 panels display 50%. The callout begins at Ability Level 2 and lists five `Damage Reduction +10%` enhancements through Ability Level 6. At +0 none of those enhancements are active; at +9, Levels 2 and 3 are active. In-game help says the ability level *increases* at relic levels +6, +9, +12, +15, and +18. The revised working scale is therefore: Ability Level 1 displays 50%; +6 enhances it to 60%, +9 to 70%, +12 to 80%, +15 to 90%, and +18 to 100%.

One activation question remains open: whether Ability Level 1 is functional immediately at relic +0, or requires a separate activation condition. The wording “increases at Relic Levels 6, 9, 12, 15, and 18” and the callout's first listed enhancement being `Lvl. 2` both favor Level 1 already existing at +0. Direct observation of an unlevelled relic triggering its effect would settle this.

The account owner inspected several other relic types at several levels and observed the same general structure: a headline Ability Level 1 effect plus five upgrade rows, regardless of the specific ability. This cross-relic observation was not screenshot-captured and remains provisional evidence. Representative captures of other ability types would strengthen the model.

## Gemstone Dependency Grades

Every relic/champion proposal must receive one of these grades. The grade applies to the complete pairing, not universally to the relic type: the same relic may be Core for one champion and Gem-dependent or Package-dependent for another.

| Grade | Meaning | Deployment rule |
|---|---|---|
| **Core** | The relic remains worth equipping without its ideal gemstones. | The ideal package is a future improvement, not a deployment prerequisite. Empty sockets or sensible temporary stones are acceptable. |
| **Gem-dependent** | The relic recommendation depends on gemstones preserving or completing its intended role. | Improvisation is allowed only when substitutes maintain the role and do not introduce unacceptable speed, Turn Meter, or other conflicts. |
| **Package-dependent** | One or more critical gemstones are necessary to justify the recommendation. | Do not recommend or deploy until the critical package is available. |

Record both the ideal gemstone package and the feasible account package before assigning a grade. A missing ideal gemstone does not automatically make a proposal Package-dependent; the question is whether its absence changes the reason for equipping the relic.

### Current Classification

| Pairing | Grade | Reason |
|---|---|---|
| Aspect of Siroth #214 → Freyja | **Core** | The relic's fatal-damage reduction directly supports Freyja's Arena survival-anchor role. Steadfast Preparation and Uncontrollable reinforce that identity, but the missing second Uncontrollable does not invalidate the deployment. |

### Hazard Classes

| Class | Meaning | Required treatment |
|---|---|---|
| **SPD** | The relic has an active or future SPD stat, or can receive a gemstone that directly changes SPD. | Calculate the exact final displayed and conditional SPD before any action. |
| **TM** | A socketed or proposed gemstone changes Turn Meter behavior. | Treat it as turn-order sensitive even if displayed SPD is unchanged. Test the triggering conditions, not only the opening turn. |
| **CLEAR** | No SPD or Turn Meter effect exists in the complete proposed state. | Ordinary deployment review still applies. Any later gemstone proposal reopens this gate. |

## The 28 Copies

`SPD at +N` identifies a future stat path. The snapshot records locked values as zero, so the actual unlocked value must be confirmed before approval.

| Tier | Relic ID | Relic | Rarity | Rank / level | Stat path | Sockets | Current speed / turn-order flag |
|---|---:|---|---|---|---|---|---|
| SS | 215 | Wand of Submission | Legendary | 3 / +0 | HP; **SPD at +9**; ACC at +15 | 4, 1, 1 | **SPD hold** |
| S | 133 | Golden Elixir | Epic | 3 / +9 | ATK; ACC; HP at +15 | 5, 1 | Clear now; recheck proposed gems |
| S | 232 | Golden Elixir | Epic | 2 / +0 | ATK; ACC at +9; HP at +15 | 5, 1 | Clear now; recheck proposed gems |
| S | 260 | Golden Elixir | Epic | 2 / +0 | ATK; ACC at +9; HP at +15 | 5, 1 | Clear now; recheck proposed gems |
| S | 273 | Golden Elixir | Epic | 2 / +0 | ATK; ACC at +9; HP at +15 | 5, 1 | Clear now; recheck proposed gems |
| S | 292 | Golden Elixir | Epic | 2 / +0 | ATK; ACC at +9; HP at +15 | 5, 1 | Clear now; recheck proposed gems |
| S | 295 | Golden Elixir | Epic | 2 / +0 | ATK; ACC at +9; HP at +15 | 5, 1 | Clear now; recheck proposed gems |
| S | 301 | Golden Elixir | Epic | 2 / +0 | ATK; ACC at +9; HP at +15 | 5, 1 | Clear now; recheck proposed gems |
| S | 306 | Golden Elixir | Epic | 2 / +0 | ATK; ACC at +9; HP at +15 | 5, 1 | Clear now; recheck proposed gems |
| S | 158 | Irethi Coronet | Epic | 3 / +9 | ATK; ACC; HP at +15 | 2, 1 | Clear now; recheck proposed gems |
| A | 209 | Aspect of Siroth | Legendary | 3 / +0 | DEF; RES at +9; ACC at +15 | 3, 1, 1 | Clear now; recheck proposed gems |
| A | 214 | Aspect of Siroth | Legendary | 3 / +9; equipped on Freyja | DEF; RES; ACC at +15 | Steadfast Preparation #295; Uncontrollable #309; one empty | Clear of SPD/TM gems; relic effect consumes TM when triggered |
| A | 69 | Journal of Necrotos | Rare | 2 / +6 | HP; DEF at +9; RES at +15 | 1 | **TM hold: Invigorated #249** |
| A | 89 | Journal of Necrotos | Rare | 2 / +6 | HP; DEF at +9; RES at +15 | 1 | **TM hold: Invigorated #235** |
| A | 92 | Journal of Necrotos | Rare | 2 / +6 | HP; DEF at +9; RES at +15 | 1 | **TM hold: Invigorated #233** |
| A | 93 | Journal of Necrotos | Rare | 2 / +6 | HP; DEF at +9; RES at +15 | 1 | **TM hold: Invigorated #252** |
| A | 94 | Journal of Necrotos | Rare | 2 / +6 | HP; DEF at +9; RES at +15 | 1 | **TM hold: Invigorated #253** |
| A | 262 | Journal of Necrotos | Rare | 1 / +0 | HP; DEF at +9; RES at +15 | 1 | Clear now; recheck proposed gem |
| A | 284 | Journal of Necrotos | Rare | 1 / +0 | HP; DEF at +9; RES at +15 | 1 | Clear now; recheck proposed gem |
| A | 114 | Molten Deathbell | Rare | 2 / +6 | ACC; DEF at +9; HP at +15 | 5 | Clear: Unbroken Strength #117 |
| A | 115 | Molten Deathbell | Rare | 2 / +6 | ACC; DEF at +9; HP at +15 | 5 | **TM hold: Extra Velocity #87** |
| A | 117 | Molten Deathbell | Rare | 2 / +6 | ACC; DEF at +9; HP at +15 | 5 | **TM hold: Extra Velocity #100** |
| A | 97 | Scroll of the Unseen | Epic | 3 / +9 | ATK; C.DMG; **SPD at +15** | 1, 1 | **SPD hold** |
| A | 106 | Scroll of the Unseen | Epic | 3 / +9 | ATK; C.DMG; **SPD at +15** | 1, 1 | **SPD hold** |
| A | 137 | Scroll of the Unseen | Epic | 2 / +6 | ATK; C.DMG at +9; **SPD at +15** | 1, 1 | **SPD hold** |
| A | 145 | Scroll of the Unseen | Epic | 2 / +6 | ATK; C.DMG at +9; **SPD at +15** | 1, 1 | **SPD hold** |
| A | 241 | Scroll of the Unseen | Epic | 2 / +0 | ATK; C.DMG at +9; **SPD at +15** | 1, 1 | **SPD hold** |
| A | 252 | Scroll of the Unseen | Epic | 2 / +0 | ATK; C.DMG at +9; **SPD at +15** | 1, 1 | **SPD hold** |

## Initial Safety Triage

| State in current snapshot | Copies | Relic IDs |
|---|---:|---|
| Future relic SPD stat | 7 | 215, 97, 106, 137, 145, 241, 252 |
| Current Turn Meter gemstone | 7 | 69, 89, 92, 93, 94, 115, 117 |
| Neither currently present | 14 | 133, 232, 260, 273, 292, 295, 301, 306, 158, 209, 214, 262, 284, 114 |

These categories describe the present snapshot only. They are not approval groups. All 28 have a Circle or Pentagonal socket capable of accepting known Turn Meter gemstones, and Wand of Submission #215 also has a Hexagonal socket compatible with known conditional-SPD gemstones. Gemstone selection can therefore move any copy back into the safety gate.

## Per-Deployment Safety Record

| Relic ID | Champion | Current SPD | Team / mode | Required order or tune | Safe range | Relic SPD now | Future relic SPD | Current gem effect | Proposed gem effect | Projected final SPD | Conditional SPD / TM behavior | Restoration plan | Approved? |
|---:|---|---:|---|---|---|---:|---:|---|---|---:|---|---|---|
|  |  |  |  |  |  |  |  |  |  |  |  |  | No |

## Deployment Log

### Freyja — Aspect of Siroth

| Field | Current state |
|---|---|
| Status | Equipped; initial deployment complete |
| Relic copy | ID 214; confirmed by account snapshot 06 |
| Rank / level | Rank 3, +9 |
| Current effect strength | **Working value: 70% of current Turn Meter at Rank 3/+9.** The 50% headline is Ability Level 1; active Ability Levels 2 and 3 add 10% each. |
| Active stat path | DEF; RES unlocked at +9; ACC remains locked until +15 |
| Gemstones | Steadfast Preparation; 1× Uncontrollable; third socket empty |
| Remaining work | Obtain a second Uncontrollable and accumulate resources for further relic levels |
| Previous relic | Gilded Dragonstone removed non-destructively and preserved with its gemstones |
| Deployment rationale | Freyja's Arena role is to remain alive while Sun Wukong repeatedly revives and pressures the enemy. Aspect reinforces that survival-anchor role by trading Turn Meter for rank-scaled fatal-damage reduction. |
| Speed review | No displayed-SPD change from this relic path or the installed gemstones; the relic's own fatal-damage effect can consume all Turn Meter and must be evaluated in battle. |

#### Arena Test Log

Freyja is already extremely difficult to kill, and that durability is the reason she is in the composition. Aspect of Siroth is therefore an infrequent emergency layer rather than an effect expected to appear every match. Activation rate alone is not the success metric; the important question is whether an activation converts an otherwise fatal sequence into enough time for Freyja and the repeatedly reviving Sun Wukong to recover the fight.

| Test | Matchup | Aspect triggered? | Freyja survived trigger? | Turn Meter consequence | Match result | Finding |
|---:|---|---|---|---|---|---|
| 1 | Classic Arena; opponent not recorded | Not observed | n/a | n/a | Not recorded | Insufficient evidence; continue testing |

For future observations, record the opposing damage/control archetype, whether the fatal-damage effect visibly triggered, whether Freyja survived the hit, whether losing her Turn Meter mattered, and whether the extra survival changed the outcome. Ordinary wins in which she was never threatened confirm team function but do not directly test Aspect's emergency value.
