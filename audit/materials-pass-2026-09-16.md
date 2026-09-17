# Materials Pass — 2026-09-16

Branch `fix/content-pass-2026-09-16`. Not pushed. Not deployed. `scripts/export-activities.sh` was not run.

## Before / after (scripts/check-content.mjs)

"Before" is the data at commit `b687b15` (new data shape, content not yet rebuilt), checked with the final checker and no exceptions. "After" is the branch head.

| Check | Before S1 | S2 | S3 | S4 | **Before** | After S1 | S2 | S3 | S4 | **After** | Accepted exceptions |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| M1 Item used but not listed | 140 | 155 | 85 | 53 | **433** | 0 | 0 | 0 | 0 | **0** | 119 |
| M2 Item listed but not used | 190 | 357 | 539 | 587 | **1673** | 0 | 0 | 0 | 0 | **0** | 0 |
| M3 Budget rule broken | 139 | 210 | 167 | 91 | **607** | 0 | 0 | 0 | 0 | **0** | 33 |
| M4 Description or cost contradicts | 46 | 246 | 44 | 15 | **351** | 0 | 0 | 0 | 0 | **0** | 0 |
| M5 Missing coaching | 0 | 0 | 0 | 0 | **0** | 0 | 0 | 0 | 0 | **0** | 0 |
| M6 Cross-version pointer | 0 | 0 | 0 | 0 | **0** | 0 | 0 | 0 | 0 | **0** | 0 |
| M7 Tier 1 too hard | 94 | 192 | 196 | 152 | **634** | 0 | 0 | 0 | 0 | **0** | 0 |
| M8 Empty section | 0 | 5 | 0 | 0 | **5** | 0 | 0 | 0 | 0 | **0** | 0 |
| M9 Grade range in duration text | 0 | 0 | 0 | 0 | **0** | 0 | 0 | 0 | 0 | **0** | 0 |
| D1 Materials shown twice | 0 | 0 | 0 | 0 | **0** | 0 | 0 | 0 | 0 | **0** | 0 |
| D2 Dash splits math | 0 | 6 | 0 | 0 | **6** | 0 | 0 | 0 | 0 | **0** | 0 |
| D3 Time in step title | 0 | 0 | 0 | 0 | **0** | 0 | 0 | 0 | 0 | **0** | 0 |
| **Total** | | | | | **3709** | | | | | **0** | 152 |

"Accepted exceptions" are findings the checker raised where the word is not a material (a story line, a feeling like "I felt", a pretend price on the board). Each one is in `scripts/check-content.ignore.json` with a one-line reason.

D1 was already fixed by the last pass, so its before count is 0. M5, M6 and M9 were already 0 after the last pass.

## What changed

- **Data shape (commit `b687b15`):** each duration has its own `materials.fromScratch` and `materials.basicClassroom` (cost, description, items), so there are 6 lists per chapter. Old chapter-level `budgetTiers` removed. Steps and version notes can carry `variants.fromScratch`, `variants.tier1` and `variants.tier1FromScratch`. `src/activityContent.ts` picks the text for the selected duration, budget and tier. The page and print show only that.
- **All 288 lists rebuilt** from what each version uses. Format: `Name — quantity, what it's for`, for 20 students.
- **From Scratch** uses only free items: plain and scrap paper, newspaper, recycled and from-home items, found objects, pencils, crayons, tape, water, the board, and a clock or phone. Where a version needed more, its text has a From Scratch variant (tear, not cut; tape, not glue; paper seed, not soil; scrap-paper tokens; paper pulp, not clay). Cost lines say $0.
- **Basic Classroom** uses normal school supplies, including art-closet supplies (clay, paint, beads, felt, pipe cleaners, stickers). Soil and seeds only where a step plants, with an honest cost line. No real food anywhere (S1 Ch8 and S2 Ch2 use paper price lists; S2 Ch5 uses smell clue cards).
- **Tier 1 (K-1):** every "Tier 1 (K-1): ..." side note is gone from steps. Steps that were too hard have full Tier 1 rewrites of the description, Say this, Watch for and Done when. They have no division, audits, percents, averages, margins, hourly rates, money over $20 or multi-step math. "Audit" steps show as "Partner Check" for Tier 1.
- **Known problems:** From Scratch water and spoon for the paper seed removed. "Soil up to the line" fixed. Say this lines that named missing things fixed wherever the checker found them.
- **Last pass guesses:** all 138 re-checked: 70 fixed, 64 kept, 4 moved to needs-Justin.
- **Last pass C2, C3, C5 leftovers:** fixed in each chapter patch. C6 names were not changed.
- **Duration descriptions:** no grade ranges in any bestFor, breakdown or activity name (M9 = 0).

## Hand check

A separate reader went line by line through 6 random versions (S1 Ch2 45 From Scratch, S4 Ch6 45 Basic Classroom, S1 Ch5 30 Basic Classroom, S3 Ch10 30 Basic Classroom, S2 Ch3 30 Basic Classroom, S4 Ch10 20 From Scratch). It found 20 must-fix and 20 minor problems, even though the checker showed 0. 36 were fixed (commit `2a58b9a`). 4 were not real: the reader said the 30-minute steps add to 20 minutes, but those versions are 10 min story + 20 min activity.

What it found that the checker cannot see:
- Tier 1 text that refers to something only the Tier 2-4 text makes (a written week count, three survey questions).
- Shared accommodations and tier adaptations that fit only one budget (real planting in a paper-seed version).
- Number problems: price lists that run past the clips handed out, stock that cannot cover orders.
- Coaching lines that name things the version does not have (erasers, grid squares).

**Every sampled version had at least one real problem.** The other 42 chapters have not had a line-by-line read. The checker only matches words.

## Checker limits

- It matches item words from a fixed vocabulary. It cannot tell whether numbers add up, whether a step fits its minutes, or whether shared text fits every version.
- M7 checks Tier 1 step text, notes and the Tier 1 focus list. Discussion questions are shared by all tiers and are not checked (one S1 Ch6 discussion question still has a "Tier 1 (K-1):" note).
- M8 checks extension ideas on the 45-minute version only, because the page shows them only there.

## Commits

- `b687b15 Materials per duration and budget level; step text can vary by budget and tier`
- `a7b2a23 Add strict content checker (M1-M9, D1-D3)`
- `86d2c58 Season 1 materials pass: six exact lists per chapter, From Scratch and Tier 1 rewrites`
- `a67acfa Season 4 materials pass: six exact lists per chapter, From Scratch and Tier 1 rewrites`
- `704e62d Season 3 materials pass: six exact lists per chapter, From Scratch and Tier 1 rewrites`
- `d8325d0 Season 2 materials pass: six exact lists per chapter, From Scratch and Tier 1 rewrites`
- `7fc519c Drop the Tier 1 side-note renderer; checker reads 'Felt' items`
- `2a58b9a Fix hand-check findings in six sampled versions`
