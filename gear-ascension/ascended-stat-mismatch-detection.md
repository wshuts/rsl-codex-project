# RAID Dashboard Proposal: Ascended Stat Mismatch Detection

## Background

As my RAID: Shadow Legends account has matured, I've become increasingly successful at **redistributing equipped gear** to create stronger champion builds.

However, this has introduced a new visibility problem.

With approximately:

* 220 fully equipped champions
* ~9 equipped items per champion (artifacts, accessories, relic)
* Nearly 2,000 equipped pieces

...I can no longer mentally detect opportunities that already exist within my account.

I suspect there is hidden value buried in this complexity.

This dashboard is intended to surface that value.

---

# Problem Statement

This is **not** a gear optimization dashboard.

Instead, it is an **exception detection dashboard**.

Specifically:

> Which equipped ascended artifacts have an ascension bonus that poorly matches the champion using them?

Example:

Sun Wukong scales primarily from Attack.

If he is wearing an artifact whose ascended stat is:

* DEF
* DEF%

that ascended bonus contributes very little to his build.

The artifact itself may be excellent.

Only the ascended bonus is mismatched.

---

# Goal

Produce a ranked list of the **highest-value ascension mismatches** across the account.

Rather than reviewing nearly 2,000 equipped pieces manually, I want the dashboard to answer:

> Show me the 10–20 equipped artifacts where rerolling the ascended stat is most likely to improve the account.

---

# Champion Profile

Each champion should have a simple scaling profile.

Example:

```text
Champion: Sun Wukong

Primary Scaling:
- Attack

Preferred Ascension Stats

★★★★★ ATK%
★★★★☆ ATK
★★★☆☆ HP%
★★☆☆☆ HP
★☆☆☆☆ DEF
☆☆☆☆☆ DEF%
```

This does not need to be mathematically perfect.

It only needs to be good enough to distinguish:

* Excellent
* Good
* Neutral
* Poor
* Very Poor

---

# Required Data

For each equipped artifact:

* Champion
* Slot
* Set
* Main stat
* Ascended stat
* Ascension level
* Current owner

Potentially also:

* Artifact rarity
* Artifact rank
* Current enhancement level

---

# Dashboard Logic

Compare:

Champion Preferred Ascension Stats

against

Actual Equipped Ascended Stat

Generate an "Ascension Alignment Score."

Possible outputs:

* Excellent Match
* Good Match
* Neutral
* Poor Match
* Severe Mismatch

---

# Chaos Dust Opportunity

The dashboard should also identify where Chaos Dust (ascended stat reroll resource) provides high expected value.

Important distinction:

A bad ascended stat is not automatically worth rerolling.

Instead, estimate:

* Current usefulness
* Possible reroll outcomes
* Probability of improvement
* Expected value

Example:

Current:

* DEF%

Possible reroll pool:

* ATK%
* HP%
* DEF%

This is much more attractive than a reroll pool where no desirable outcome exists.

---

# Desired Dashboard Views

## 1. Worst Mismatches

Sort by lowest Ascension Alignment Score.

---

## 2. Highest Expected Gain

Estimate where one Chaos Dust use has the greatest potential benefit.

---

## 3. By Champion

Show all equipped ascended artifacts for a selected champion with their alignment scores.

---

## 4. By Resource Priority

Examples:

* Immediate reroll candidate
* Wait
* Ignore
* Already optimal

---

# Design Philosophy

This dashboard should reduce cognitive overload.

It is intentionally **not** trying to optimize every artifact.

Instead, it functions as an **exception report**.

Rather than asking:

> Is every champion perfectly optimized?

It asks:

> Which few mismatches deserve my attention today?

The objective is to create a bounded maintenance workflow that consistently uncovers hidden account value without requiring a full account audit.
