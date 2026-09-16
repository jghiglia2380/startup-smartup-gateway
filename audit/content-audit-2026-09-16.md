# Content Audit — startup-smartup-gateway

Date: 2026-09-16. Read-only audit. No source or data was changed.

- Branch: `main` (2 commits ahead of `origin/main`)
- Last commit: `67d6fcc Retire premium budget tier in the UI; rename budget labels`
- Data audited: `src/activitiesData.json` **as it is on disk now**. This file has uncommitted changes (+3533 / -1009 lines vs HEAD). The dev server reads this version.
- Render code: `src/ActivityDetail.tsx` (opened from `src/Dashboard.tsx:350`)
- Scope: 4 seasons × 12 chapters × 3 durations (20/30/45) × 2 shown budgets (From Scratch = `standard`, Basic Classroom = `lowCost`). `premium` is hidden and not audited.

## Summary

| Check | What is counted | S1 | S2 | S3 | S4 | Total |
|---|---|---:|---:|---:|---:|---:|
| C1 | Missing coaching (version notes + steps with no coaching) | 150 | 162 | 159 | 161 | 632 |
| C2 | Budget vs steps conflicts / items not in materials | 41 | 51 | 88 | 56 | 236 |
| C3 | Tasks too hard for tier (plus bestFor note, see below) | 19 | 22 | 35 | 24 | 100 |
| C4 | Empty accommodation headings | 36 | 36 | 36 | 36 | 144 |
| C5 | Cross-version / off-page references | 12 | 19 | 21 | 22 | 74 |
| C6 | Chapters with character name drift | 2 | 2 | 0 | 1 | 5 |
| C7 | Page/item references to check by hand | 100 | 88 | 87 | 72 | 347 |
| D1 | Chapters where materials show twice | 12 | 12 | 12 | 12 | 48 |
| D2 | Steps with inline dash lists | 7 | 27 | 9 | 0 | 43 |
| D3 | Step titles that repeat the time tag | 12 | 63 | 0 | 0 | 75 |

Notes on the counts:
- **C1:** Only the 45-min versions have coaching. Every 20-min and 30-min version has no Before class, no Running long or short, and no Say this / Watch for / Done when on any step. Breakdown by duration is below.
- **C2:** Includes items marked *(uncertain)*: S1 26, S2 31, S3 47, S4 28. These need a human look.
- **C3:** Also, in all 48 chapters, the page shows every duration under every tier. The 20-min says "K-1", the 30-min says "grades 1-3", and the 45-min says "grades 3-4". So Tier 1 (K-1) can show the "grades 3-4" version. That structural problem is not in the count.
- **C4:** All 3 headings are empty in all 48 chapters.
- **C5:** Most are cross-chapter or off-page references. True cross-version references: S1 Ch2 45 min step 1, S3 Ch12 45 min Before class.
- **D1:** One cause in code. It affects every chapter.

### C1 by duration

| Duration | Item | S1 | S2 | S3 | S4 | Total |
|---|---|---:|---:|---:|---:|---:|
| 20 min | Before class + Running long/short missing | 24 | 24 | 24 | 24 | 96 |
| 20 min | Steps with no Say this / Watch for / Done when | 45 | 55 | 52 | 51 | 203 |
| 30 min | Before class + Running long/short missing | 24 | 24 | 24 | 24 | 96 |
| 30 min | Steps with no Say this / Watch for / Done when | 57 | 59 | 59 | 62 | 237 |
| 45 min | Before class + Running long/short missing | 0 | 0 | 0 | 0 | 0 |
| 45 min | Steps with no Say this / Watch for / Done when | 0 | 0 | 0 | 0 | 0 |

## Display bugs (D1–D3)

### D1. Materials list shows twice
- `src/ActivityDetail.tsx:222-229` renders `timeVersion.materials` as a plain list.
- `src/ActivityDetail.tsx:231-244` then renders `budgetInfo.items` in a box, inside the same "Materials Needed" section.
- Both always render. There is no condition. The data makes it look like a duplicate: in 36 of 144 versions the version materials list is exactly the same as the `standard` budget items. In the other 108 versions the two lists share no exact line, so the teacher sees two different materials lists under one heading.

### D2. Inline dash lists
- `src/ActivityDetail.tsx:284` renders the whole step description in one `<p>`. It does not split on " - " or "*". So the list shows as one run-on paragraph.
- Not counted: " - " used as a minus sign (S3 Ch12 45/5; S4 Ch3 45/2, 45/5; S4 Ch6 20/3, 30/3, 45/6; S4 Ch12 45/1). S3 Ch12 45/5, S4 Ch3 45/2, 45/5 and S4 Ch12 45/1 look like lists that lost their line breaks (items run together with no dash).

### D3. Step titles that repeat the time tag
- `src/ActivityDetail.tsx:279-282` shows `step.title` next to a `step.duration` pill. The title text already has "(N minutes)".

## Other things found (not in the table)

Wrong facts or numbers:
- **S1 Ch6, 30 min, step 2:** "Day 6: 35¢ (two dimes and a nickel)". Two dimes and a nickel = 25¢. The $4.73 total uses 35¢.
- **S2 Ch9, 45 min, steps 1-2 + Done when:** Money does not add to $200. Step 2 gives $150 cash + $30 seeds/tools = $180. Done when says the pool "reaches $200". Step 1 says $180 cash.
- **S2 Ch10, Tier 2 focus:** "60¢ + $1.50 = $2". Correct sum is $2.10.
- **S3 Ch6, 45 min, step 4:** Formula reads "(price cost) / price = margin %". The minus sign is missing.

Other page issues:
- S2, S3, S4 (36 chapters): `description.en` is `null` and `topic.en` is empty. The overview card at `src/ActivityDetail.tsx:209` shows no description.
- Tier grade labels disagree. `src/Dashboard.tsx:45-90` says Tier 2 = "2", Tier 3 = "3", Tier 4 = "4". The data `tierDifferentiation.gradeLevel` says "1-2", "2-3", "3-4". The activity header (`src/ActivityDetail.tsx:113`) uses the data label.
- Spanish: 1,828 of 1,852 en/es text pairs are the same text. Only 24 differ. Coaching fields render `.en` only (`src/ActivityDetail.tsx:255-302`), so Spanish mode shows English coaching.
- S2 chapter titles vs activity content (from the C6 read): Ch4 "Mr. Mason's Trunk" never names Mr. Mason; Ch6 "The Fish Auction" never mentions fish; Ch11 only the 45-min mentions Day of the Dead; Ch12 "La Tamalada" only the 45-min mentions tamales.

## Season 1

### Ch1 — Neighborhood Treasure Hunt (story: The Secret Garden)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when

**C3 Grade mismatch**
- 30 min, step 3: Value card writing for grades 1-3 in 5 minutes, per item (3 items): "I found a ___. It's special because ___. It would cost money to buy because ___. But I got it for ___ (free / found it)." — four written blanks x 3 cards is long writing for grade 1. *(uncertain)*

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C5 Cross-version / off-page references**
- 45 min, step 1: "You're setting up a Treasure Exhibition like the friends did at the end of Season 1." — Points to story content from the end of the season (Chapter 12), not on this page.

**C7 Page/item references (check by hand)**
- 45 min, step 3, Say this: "Five things on every card. What it is. Where you found it. Why it's worth something. What a store would charge for it. And why it's going in your exhibition."
- 45 min, step 3, Done when: "Every item has a card with all five lines filled."
- 45 min, step 5, Say this: "One sticker each. Put it on the most valuable thing in this room."
- 45 min, step 6, Say this: "Flip your card over. What would a store charge for this?"
- 45 min, step 1, Done when: "Three students picked at random have each named one thing they're hunting for."
- 45 min, step 2, Done when: "Every student is holding at least three items."

**D3 Title repeats time tag:** 45 min step 6 "Price the Exhibition (10 minutes)" next to "10 minutes"

### Ch2 — Plant & Save: The Patience Jar (story: The Seed Library)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 30 min, step 2 [budget: standard]: Standard description says "A full paper simulation... No planting." but 30-min Step 2 'Plant Your Seed': "Fill cups with soil. Make a small hole. Place seed. Cover gently. Label with name marker. Water lightly."
- 45 min, step 1 [budget: standard]: Standard description "No planting" contradicted by 45-min Before class ("Fill the cups with soil") and Step 1 'Plant Your Seed' ("Soil up to the line. Seed in. Cover it. One spoon of water").
- 30 min, step 2 [budget: lowCost]: lowCost cost '$0' and "Everything else is already in the room" — but planting needs soil and seeds, which are not classroom stock and not in any budget list.
- 45 min, step 1 [budget: lowCost]: lowCost '$0' / "already in the room" vs Before class + Step 1 needing soil, seeds, spoon, water.
- 30 min, step 2 [budget: both]: Items used in Step 2 not in MATERIALS. Missing: soil, seeds, water, name marker / labels.
- 45 min, step 1 [budget: both]: Items used in Before class and Step 1 (Say this / Watch for / Done when: 'labeled with a name') not in MATERIALS. Missing: soil, seeds, spoon, water, labels / marker for names.
- 45 min, step 5 [budget: both]: Step 5 'Class Savings Jar' uses "a large piece of paper displayed in class" / "the class sheet"; no chart paper or large paper in MATERIALS (only plain paper, 4 per student for journals). Missing: large paper / chart paper for class sheet. *(uncertain)*
- 45 min, step 4 [budget: both]: Step 4 'scrap-paper audit slip' — scrap paper not listed; plain paper is allotted 4 per student for the journal. Missing: scrap paper for audit slips. *(uncertain)*

**C3 Grade mismatch**
- 20 min, step 3: K-1 students asked to "write or say: 'By Week 4 I will have $___. By Week 10 I will have $___.'" — writing dollar amounts; mild for K. *(uncertain)*
- 45 min, step 2: (For reference, shows under Tier 1/2 too) Watch for: "Make them do the division"; Step 4 'Portfolio Audit' — audit of growth chart math.
- chapter-level: Tier 1 FOCUS "Add one coin to the jar each week" — no coins in any budget/materials (paper simulation); not too hard, but item absent. *(uncertain)*

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C5 Cross-version / off-page references**
- 45 min, step 1: "Follow same planting steps as 30-minute version." — Cross-version reference; 45-min page does not list those steps in its description.

**C6 Character names** *(uncertain)*
- Names: 20 min: Frances, Riley; 30 min: Riley, Frances; 45 min: Frances, Benny
- Chapter title 'The Seed Library'. Frances (seed saver) and Riley (impatient about her seed) appear as different roles in 20/30; 45 drops Riley and introduces Benny ("Benny chose sunflower seeds"). Not clearly a conflict.
- Uncertain: 20-min Step 1 has Frances saying how long a seed takes, discussion has Riley waiting for 'her seed'; Ch11 45-min says 'Riley planted flower seeds' in Chapter 2 while Ch2 45 says Benny chose sunflower seeds — consistent only if multiple children planted.

**C7 Page/item references (check by hand)**
- 45 min, step 1, Say this: "One spoon of water — one."
- 45 min, step 1, Done when: "Every cup is planted, labeled with a name, and drawn in the log."
- 45 min, step 2, Say this: "Four pages. What you're saving for and what it costs. A chart with the first twelve weeks drawn in. One thing you could skip buying this week. And what a dollar a week gets you after a year."
- 45 min, step 2, Done when: "All four pages have writing on them and page three shows a number of weeks."
- 45 min, step 4, Done when: "Every book has an audit slip and one initialed revision."
- 45 min, step 5, Say this: "Name and goal on the class sheet."
- 45 min, step 5, Done when: "Every name is on the sheet with a goal next to it."

**D2 Inline dash lists:** 45 min step 2

**D3 Title repeats time tag:** 45 min step 4 "Portfolio Audit (10 minutes)" next to "10 minutes"

### Ch3 — Set Up the Trading Post (story: The Trading Post)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 45 min [budget: both]: Before class: "Count out ten tokens per student into cups or envelopes" — cups/envelopes not in MATERIALS or either budget. Missing: cups or envelopes.
- 45 min, step 8 [budget: both]: Step 8 "Fill in trade log" — no trade log sheet listed (plain paper is allotted for value card squares). Missing: trade log sheet. *(uncertain)*
- 30 min, step 1 [budget: both]: Budget descriptions say "Students bring one item from home"; 30-min Step 1 "For each item" and 45-min Watch for "Whole booths of five-token items" assume several items per student (chapter description says 1-3). *(uncertain)*
- 45 min, step 2 [budget: lowCost]: lowCost lists construction paper for tokens but not scissors or plain paper (for value cards), and its description does not say these are already in the room (it copies the standard description). Missing: scissors, plain paper, pencils. *(uncertain)*

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C7 Page/item references (check by hand)**
- 45 min, step 1, Say this: "Small or common is one token. Medium is three. Something nobody else has is five. Write it on the card."
- 45 min, step 1, Done when: "Every item has a token value written on a card."
- 45 min, step 2, Say this: "Ten tokens each."
- 45 min, step 2, Done when: "Every student has ten tokens on their desk."
- 45 min, step 7, Say this: "Three columns. The item. What you said it was worth. What it actually traded for. Everybody puts up one row."
- 45 min, step 7, Done when: "Every student has a row and the board is sorted into went up, went down, never traded."
- 45 min, step 8, Done when: "Every log is totaled and two students have answered the untraded-items question out loud."
- 45 min, step 6, Done when: "At least three students have changed a price on a card."

**D3 Title repeats time tag:** 45 min step 7 "The Value Board (10 minutes)" next to "10 minutes"

### Ch4 — Map It! Classroom Expedition & Blueprint Challenge (story: The Creek Explorers)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 45 min, step 1 [budget: both]: Step 1 "Expedition Planning Sheet" — a named sheet with no template on page or in MATERIALS (plain paper could serve). Missing: Expedition Planning Sheet. *(uncertain)*
- 30 min, step 2 [budget: both]: Step 2 "Discovery Log" — not in MATERIALS (plain paper could serve). Missing: Discovery Log. *(uncertain)*
- 45 min, step 4 [budget: both]: Step 4: teams of four combine maps "on a shared sheet"; only 2 chart paper sheets listed, one used for the class map. Missing: shared sheet per team (chart paper). *(uncertain)*
- 45 min [budget: both]: Before class: "Have the class map already on the wall" — no tape listed to hang it. Missing: tape. *(uncertain)*

**C3 Grade mismatch**
- 20 min, step 2: K-1: "Students draw a simple top-down map of the classroom from memory" and label 3 spots by category (useful / interesting / overlooked) in 4 minutes — top-down perspective from memory is hard for K. *(uncertain)*
- 30 min, step 2: Grades 1-3: Discovery Log written entries at 3+ spots: "I found ___. It's ___ (free / useful / interesting). I notice it because ___." *(uncertain)*

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C7 Page/item references (check by hand)**
- 45 min, step 1, Done when: "Every planning sheet has a route drawn on it."
- 45 min, step 2, Done when: "Every log has at least three finds written in it."
- 45 min, step 3, Say this: "Hand over your map and your plan. Not your log. ... Write what you found on their sheet."
- 45 min, step 3, Done when: "Every planning sheet has a partner's note written on it."
- 45 min, step 4, Say this: "Four maps, one page."
- 45 min, step 5, Say this: "One sticky note."
- 45 min, step 5, Done when: "Every student has a note on the class map."

**D3 Title repeats time tag:** 45 min step 4 "Build the Class Guidebook (10 minutes)" next to "10 minutes"

### Ch5 — The Skills Fair (story: Riley's Art Stand)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 45 min, step 3 [budget: both]: Step 3 learners "fill in their Passport" — passport is in MATERIALS as plain paper, but no step or Before class tells anyone to fold/make it. *(uncertain)*

**C3 Grade mismatch**
- 20 min, step 2: K-1: "Students draw and write their skill on an index card: 'I am good at ___. I could teach someone to ___ in ___ minutes.'" — writing plus estimating minutes. *(uncertain)*

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C7 Page/item references (check by hand)**
- 45 min, step 1, Say this: "Four lines. What the skill is. What you can teach me. What somebody needs to do it well. And the hardest part."
- 45 min, step 1, Done when: "Every student has a card with all four lines filled."
- 45 min, step 2, Say this: "Cards on desks. One silent minute."
- 45 min, step 3, Say this: "Three rounds, five minutes each. ... Learners fill in the passport."
- 45 min, step 3, Done when: "Every passport has three entries in it."
- 45 min, step 4, Done when: "Every student has written and delivered one card."
- 45 min, step 5, Say this: "Put a price on your card."
- 45 min, step 6, Done when: "The list is on the board and the count is written at the bottom."

**D3 Title repeats time tag:** 45 min step 5 "What Is This Skill Worth? (10 minutes)" next to "10 minutes"

### Ch6 — Classroom Savings Jar Simulation (story: The Penny Hunt)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 20 min, step 2 [budget: both]: Budgets: "All coins are paper." 20-min Step 2 gives each group "a pile of mixed coins" sorted into pennies, nickels, dimes, quarters; no Before class or step makes/labels paper coins by denomination, and 10-min activity leaves no time to cut them. Missing: pre-made denomination-marked paper coin piles. *(uncertain)*
- 45 min, step 2 [budget: both]: Budgets say "All coins are paper"; 45-min Step 2 says "30 'coins' (paper or play)" — play coins are not in any budget. Missing: play coins (optional). *(uncertain)*
- 45 min, step 4 [budget: both]: Step 4 "Vote by written ballot" — ballots not listed (plain paper could serve). Missing: ballots. *(uncertain)*
- 45 min, step 6 [budget: both]: Step 6 "Record the winning decision in the class savings ledger" — no class ledger sheet/chart paper listed. Missing: class savings ledger. *(uncertain)*

**C3 Grade mismatch**
- 20 min, step 4: K-1: sort and count pennies, nickels, dimes, quarters, then "Add up the total" — multi-denomination money addition (intro frames a $4.73 total).
- 30 min, step 3: Grades 1-3: "Students add up all 7 days... Correct answer: $4.73" — decimal money addition of 7 amounts incl. $3.45.
- 30 min: Discussion: "If you save $4.73 per week, how much do you have in a month? ($18.92)" — decimal multiplication.
- 30 min, step 2: Fact error in Step 2: "Day 6: 35¢ (two dimes and a nickel)" — two dimes and a nickel = 25¢. The $4.73 total uses 35¢.

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C7 Page/item references (check by hand)**
- 45 min, step 1, Say this: "Four columns. Date. Amount. Running total. Where you found it."
- 45 min, step 1, Done when: "Every ledger has four labeled columns."
- 45 min, step 2, Say this: "Thirty coins are hidden in this room."
- 45 min, step 2, Done when: "All thirty coins are found and every one is written in somebody's ledger."
- 45 min, step 3, Done when: "One agreed grand total is written on the board."
- 45 min, step 4, Say this: "Three proposals. Split it equally. Save it four more weeks. Spend it on something everyone gets."
- 45 min, step 4, Done when: "All three proposals have been heard and every ballot is in."
- 45 min, step 5, Done when: "Two teams have read a complete budget out loud."
- 45 min, step 6, Say this: "Write the decision in the class ledger."
- 45 min, step 6, Done when: "The decision is written in the ledger and two students have said what changed their thinking."

**D2 Inline dash lists:** 30 min step 2; 45 min step 4

**D3 Title repeats time tag:** 45 min step 5 "Spend It On Paper (10 minutes)" next to "10 minutes"

### Ch7 — Blueprint & Build Challenge (story: The Secret Fort)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 30 min, step 1 [budget: both]: Both budgets: "Four teams of five." 30-min Step 1: "Teams of 2-3" with three roles.
- 45 min, step 2 [budget: both]: Both budgets: "Four teams of five." 45-min has four roles and Done when "signed by all four".
- 20 min, step 2 [budget: both]: 20-min is individual ("remaining 2 sheets of paper and 1 strip of tape"), not four teams of five; per-team craft sticks/index cards unused. *(uncertain)*
- 30 min, step 3 [budget: both]: Step 3 "materials listed on the budget card" — no budget card in MATERIALS; Step 4 requires measuring "taller than 6 inches" with no ruler listed. Missing: budget card, ruler.
- 20 min, step 3 [budget: both]: Step 3 "Teacher measures each structure with a ruler or hand-widths" — ruler not listed (hand-widths alternative given). Missing: ruler. *(uncertain)*
- 45 min [budget: both]: Before class: "one tray per team", "put the class chart up", "Check you have something to measure with"; Step 1 "Distribute role cards". None in MATERIALS or budgets. Missing: trays, class chart / chart paper, ruler / measuring tool, role cards.

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C7 Page/item references (check by hand)**
- 45 min, step 1, Say this: "Four jobs, and they're real."
- 45 min, step 1, Done when: "Every team member is holding a role card and one member of each team has said their job out loud."
- 45 min, step 2, Done when: "Every blueprint is drawn, listed and signed by all four."
- 45 min, step 3, Done when: "Every team has a standing structure and a deviation check marked on their blueprint."
- 45 min, step 4, Say this: "If you spot something in this room that isn't in your tray..."
- 45 min, step 5, Say this: "Three tests. Stands for fifteen seconds. Has a roof. Taller than eight inches. ... it goes on the chart either way."
- 45 min, step 5, Done when: "Every structure is tested and every result is on the chart."
- 45 min, step 6, Say this: "Two things on the slip. One place it matches, one place it doesn't."
- 45 min, step 6, Done when: "Every team has a slip and has written which they chose on their blueprint."
- 45 min, step 7, Say this: "Did you use everything in your tray?"

**D2 Inline dash lists:** 45 min step 1

**D3 Title repeats time tag:** 45 min step 6 "Cross-Inspection & Repair (10 minutes)" next to "10 minutes"

### Ch8 — Recipe Math: Cost Per Serving Challenge (story: Frances's Recipe Box)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 45 min [budget: both]: Both budget descriptions: "The teacher writes the price list on the board." 45-min Before class: "Print the price list; every student needs one in front of them." Step 1 Done when: "Every student has the price list with three items circled." Printing/copies not in budget ($0). Missing: printed price list copies.
- 30 min, step 1 [budget: both]: Step 1 "Display the trail mix recipe" and Step 2 worksheet ingredient costs — the recipe and its prices (totaling $1.10) are not on the page or in MATERIALS. Missing: trail mix recipe with ingredient prices.
- 45 min, step 5 [budget: both]: Step 5 "Teacher provides examples" of store-bought prices — no store price list provided. Missing: store-bought price examples. *(uncertain)*

**C3 Grade mismatch**
- 20 min, step 2: K-1 unit-cost math: "Homemade soup: $3 for 6 bowls = $0.50/bowl. Can soup: $1.50 per bowl"; "1 lemon ($0.50) + water + sugar ($0.25) = 4 glasses. Store lemonade: $1 per glass. Which costs less per glass?" — decimals and division.
- 20 min, step 1: K-1 intro: "Frances made bread for $2 that fed 12 people. A store muffin also costs $2 — but it feeds one person." *(uncertain)*
- 30 min, step 3: Grades 1-3: "$1.10 ÷ 4 = $0.275 ≈ $0.28 per serving" — division, three-place decimals, rounding.
- 30 min, step 4: "How much do you save per serving?" ($1.22) "If your family makes this once a week, how much do you save in a year?" — multi-step decimal money math.
- chapter-level: Tier 2 (1-2) FOCUS: "Find the cost for one serving with help" — division of money for grades 1-2. *(uncertain)*

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C5 Cross-version / off-page references**
- 30 min, step 1: "Display the trail mix recipe." — Content not on the page.
- 45 min, step 1: "Review price list together." — Price list content not on the page.
- 45 min: "What's the tradeoff for a recipe that saves $1.22/serving?" — Discussion question uses the $1.22 figure from the 30-min trail mix version; 45-min students design their own recipes. *(uncertain)*

**C7 Page/item references (check by hand)**
- 45 min, step 1, Say this: "Circle three things on the list you'd use."
- 45 min, step 1, Done when: "Every student has the price list with three items circled."
- 45 min, step 2, Done when: "Every recipe has between three and six ingredients with amounts."
- 45 min, step 3, Done when: "Every sheet has a batch total and a serving count."
- 45 min, step 5, Say this: "Then times it by fifty-two."
- 45 min, step 5, Done when: "Every sheet has a saving per serving and a yearly figure."
- 45 min, step 6, Done when: "Every student is under the target and a partner has initialed the new math."
- 45 min, step 7, Done when: "Every student has presented and their trade-off is written on their sheet."

**D2 Inline dash lists:** 20 min step 2

**D3 Title repeats time tag:** 45 min step 6 "Cut the Cost (10 minutes)" next to "10 minutes"

### Ch9 — Fix-It Workshop (story: The Repair Shop)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 30 min, step 3 [budget: both]: Standard: "The teacher damages the items in advance" (materials are paper and index cards only). 30-min Step 3 replacement costs "book = $5-15, frame = $10-20" imply a book and a frame among the 4 broken items; none in MATERIALS. Missing: book, frame. *(uncertain)*
- 45 min, step 4 [budget: both]: Step 4 "Fill in full worksheet" / repair reports — no worksheet or template in MATERIALS. Missing: repair report worksheet. *(uncertain)*
- 45 min, step 5 [budget: both]: Step 5 "Students time-stamp each of their four repairs from their report" — no clock/timer listed, and no earlier step tells students to record repair times. Missing: clock / timer. *(uncertain)*
- 20 min [budget: both]: 20-min has no Before class, yet Step 1 needs each student to receive a pre-torn card. *(uncertain)*

**C3 Grade mismatch**
- 20 min, step 3: K-1: "A pack of index cards costs $3 for 100 cards — about 3 cents each. How much did your repair cost?" — unit cost from division. *(uncertain)*
- 30 min, step 3: Grades 1-3: chart per item "Cost to fix | Cost to replace | Money saved" with "index card = $0.03, book = $5-15, frame = $10-20" — decimal/range money subtraction across 4 items.

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C5 Cross-version / off-page references**
- 45 min, step 2: "Quality Inspectors review 3-4 students' work mid-round" — Role not set up anywhere in this chapter (Quality Inspector is a Chapter 7 role). *(uncertain)*

**C7 Page/item references (check by hand)**
- 45 min, step 1, Say this: "All four items, in writing."
- 45 min, step 1, Done when: "Every student has a written diagnosis for all four items."
- 45 min, step 2, Say this: "Your two easy ones first."
- 45 min, step 2, Done when: "Every student has two items in front of them with a repair on each."
- 45 min, step 3, Say this: "The two hard ones."
- 45 min, step 3, Done when: "All four items are in front of every student with a repair attempted on each."
- 45 min, step 4, Say this: "Fill in all four. Cost to fix. Cost to replace. What you saved."
- 45 min, step 4, Done when: "All four rows are filled for every student, failures included."
- 45 min, step 5, Done when: "Every student has a real cost per repair and at least one circle on their sheet."
- 45 min, step 7, Say this: "Who fixed all four?"
- 45 min, step 7, Done when: "The tally is on the board and at least one student has held up an item they couldn't fix."

**D3 Title repeats time tag:** 45 min step 5 "Shop Rates (10 minutes)" next to "10 minutes"

### Ch10 — Community Resource Map (story: The Library Adventure)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 45 min, step 2 [budget: both]: Step 2 "completes a profile for each (using the template)" — no template on page or in MATERIALS (index cards listed 'for resource profiles'). Missing: resource profile template. *(uncertain)*

**C3 Grade mismatch**
- 30 min, step 4: Grades 1-3: "If you used these instead of buying, how much money could you save in a week? A month?" — open-ended money estimation. *(uncertain)*

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C5 Cross-version / off-page references**
- 45 min, step 2: "(using the template)" — Template not on the page.

**C7 Page/item references (check by hand)**
- 45 min, step 1, Say this: "Six categories on the board. Three minutes."
- 45 min, step 1, Done when: "Every category has at least two entries on the board."
- 45 min, step 2, Say this: "Pick three."
- 45 min, step 2, Done when: "Every student has three completed profiles."
- 45 min, step 3, Done when: "Every profile is on the map with a saves-you figure."
- 45 min, step 4, Say this: "One or two notes. ... They all go in this corner."
- 45 min, step 4, Done when: "Every student has at least one note in the corner."
- 45 min, step 5, Done when: "Every team has pitched and every score is tallied on the board."

**D2 Inline dash lists:** 45 min step 1

**D3 Title repeats time tag:** 45 min step 5 "Pitch Your Resource (10 minutes)" next to "10 minutes"

### Ch11 — Giving Circle: The Abundance Simulation (story: The Giving Garden)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 45 min, step 1 [budget: both]: Step 1 "Students complete their Investment Card" — no Investment Card in MATERIALS. Missing: Investment Card. *(uncertain)*
- 45 min, step 2: Step 2 "Distribute 10 tokens unevenly: some students get 15..., some get 8, some get 5, some get 3" — '10 tokens' conflicts with amounts of 15/8/5/3. *(uncertain)*
- 20 min [budget: both]: Budgets: "Paper squares in three colors are the money" / "three token values"; no version uses different token values (all counts treat tokens as equal). *(uncertain)*

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C5 Cross-version / off-page references**
- 30 min: "The seeds the friends planted in Frances's garden (Chapter 2) grew into enough to share." — Cross-chapter reference (discussion).
- 45 min, step 1: "Think back to Chapter 2. Riley planted flower seeds." — Cross-chapter reference.
- 45 min, step 1: "Back to chapter two." — Cross-chapter reference (Say this).

**C6 Character names**
- Names: 20 min: Frances; 30 min: Frances; 45 min: Riley, Frances, Layla, Benny
- Who grew/gave away the vegetables differs: 20-min "The friends grew more vegetables than they could use. They gave them away."; 30-min Step 3 "Frances grew more than she could use — she gave the excess" and Step 5 "Frances had 3 full baskets"; 45-min discussion "Layla gave away vegetables."
- Chapter 2 seeds: 30-min says 'the friends planted in Frances's garden'; 45-min says 'Riley planted flower seeds' (Ch2 45-min says Benny chose sunflower seeds). Possibly compatible.

**C7 Page/item references (check by hand)**
- 45 min, step 1, Done when: "Every card names one thing invested and one thing returned."
- 45 min, step 2, Done when: "Every student has their envelope and at least one person has said "that's not fair"."
- 45 min, step 3, Done when: "Every journal has at least one entry, including "gave nothing"."
- 45 min, step 4, Say this: "Five tokens is what a person needs."
- 45 min, step 5, Done when: "At least one chain of three is drawn on the board."
- 45 min, step 6, Say this: "Three columns. After each round, the highest number in the room and the lowest. Subtract. ... Copy the three numbers down and draw the line."
- 45 min, step 6, Done when: "Every student has drawn the line and the winning rule is circled on the board."

**D3 Title repeats time tag:** 45 min step 6 "Graph the Gap (10 minutes)" next to "10 minutes"

### Ch12 — My Season 1 Treasure Book & Exhibition Walk (story: The Treasure Exhibition)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5, 6 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 45 min [budget: both]: Both budgets: "The treasure book is folded and stapled by the student." 45-min Before class: "Fold and staple the mini-books in advance".
- 45 min [budget: both]: Standard: "The certificate is hand-written or stamped on cardstock." 45-min Before class: "Have the certificates printed with names already on them." Missing: printer / printed certificates.
- 45 min, step 5 [budget: both]: Step 5 "presents (or tapes to desk)" certificate — tape not in MATERIALS or budgets. Missing: tape. *(uncertain)*

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C5 Cross-version / off-page references**
- 45 min, step 6: "Twelve rows, one per chapter. ... The exhibition. The seed. The trading post. The map. The skills. The jar. The fort. The meal deal. The repairs. The guide. The giving rounds. This book." — Cross-chapter references to all Season 1 chapters (content not on page).
- 20 min, step 2: "could be from a season activity" — Cross-chapter reference. *(uncertain)*

**C7 Page/item references (check by hand)**
- 45 min, step 1, Say this: "Four pages. A treasure... A skill, and how somebody would learn it in three steps. Your savings goal, with the weeks. And one thing you're going to share this week"
- 45 min, step 1, Done when: "All four pages are complete and page four is in the future tense."
- 45 min, step 2, Say this: "Name on a card out front where a stranger can read it."
- 45 min, step 3, Say this: "At each one you can leave a star on your favorite page, write a response card, or just read."
- 45 min, step 3, Done when: "Every exhibit has at least three stars or response cards on it."
- 45 min, step 4, Done when: "Every student has at least one card to read."
- 45 min, step 5, Done when: "Every name has been read and every certificate handed over."
- 45 min, step 6, Say this: "Twelve rows, one per chapter."
- 45 min, step 6, Done when: "All twelve rows are filled and a total is written at the bottom."
- 45 min, step 7, Done when: "The class list is on the board with at least one non-object on it."

**D2 Inline dash lists:** 45 min step 1

**D3 Title repeats time tag:** 45 min step 6 "The Season Ledger (5 minutes)" next to "5 minutes"


## Season 2

### Ch1 — The Great Classroom Swap (story: The Swap Meet)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 20 min, step 2 [budget: both]: Step 2 'Track who trades and who doesn't on class chart' and step 4 'Chart the results together' need a class chart; not in 20-min MATERIALS and not in either budget. Missing: class chart / chart paper. *(uncertain)*
- 45 min [budget: both]: Before class: 'Keep a box of classroom oddments by the door' and 'Tape for the signs' are not in 45-min MATERIALS. Tape is in standard items (masking tape) and assumed on hand in lowCost; the oddments box is in neither budget (budgets list 'Five spare trade items'). Missing: box of classroom oddments, tape.
- all versions [budget: standard]: Standard ('From Scratch') description says 'Assumes the room has nothing. Season 1 kit already bought.' but version materials need items not in standard items: paper for name tags, pencils/crayons (20); markers (30); markers, colored pencils, decorating materials, poster paper, trade tracking sheets (45). Missing: pencils, crayons, markers, colored pencils, decorating materials, trade tracking sheets. *(uncertain)*

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C5 Cross-version / off-page references**
- budget min: "Index cards ... this buy covers Chapters 1, 2, 4, 8 and 12"
- budget min: "Masking tape, 1 roll — hanging booth signs; reused in Chapter 12"

**C7 Page/item references (check by hand)**
- 45 min, step 1, Say this: "Sign on the front with your name. Then a card for every single thing you brought"
- 45 min, step 1, Done when: "Every desk has a name sign and a card sitting beside every item."
- 45 min, step 2, Done when: "Two volunteers have acted out an offer, a counter and a no-deal in front of the class."
- 45 min, step 3, Done when: "every shopper has visited at least three booths."
- 45 min, step 5, Say this: "Four boxes. What you brought. What you gave away. What you're holding now. And a number out of ten"
- 45 min, step 5, Done when: "Every tracking sheet has all four boxes filled and the class trade count is on the board."

**D2 Inline dash lists:** 45 min step 1; 45 min step 2; 45 min step 5

### Ch2 — Lemonade Stand Showdown (story: The Lemonade Problem)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 20 min, step 1 [budget: both]: 20-min MATERIALS are menu paper, crayons/markers, menu template, but steps run a stand sale: step 1 'a pile of paper clips as coins, price signs, and 'cups' to sell', step 2 'Each customer starts with 10 paper clips', step 5 'counts the paper clips'. No step designs a menu. Paper clips and index cards (price tags) are in both budgets; 'cups' only as colored-paper cup cards in both budgets. Missing: paper clips, price signs, cups.
- 30 min, step 1 [budget: both]: Step 1 'price signs' not in 30-min MATERIALS (materials list stand signs and menu cards). Step 1 'cups' only appear as optional paper cups; paper cups are in neither budget (budgets list colored paper cup cards). Missing: price signs, cups. *(uncertain)*
- 45 min, step 1 [budget: both]: Steps 1-5 use 'cups' ('its cups counted on the desk'); 45-min MATERIALS have only an optional colored paper disc per cup, no cups. Step 5 'Write both numbers down' needs paper/sheets (sales tracking sheets listed). Paper cups not in either budget. Missing: cups. *(uncertain)*
- all versions [budget: standard]: Standard ('From Scratch') description says 'Assumes the room has nothing. Season 1 kit already bought.' but version materials need items not in standard items: crayons, markers (20); cardboard, tally sheets (30); cardboard, markers, sales tracking sheets, timer, graphing materials (45). Missing: markers, crayons, cardboard, timer, graphing materials. *(uncertain)*

**C3 Grade mismatch**
- 20 min, step 2: K-1 version has students set cheap/medium/expensive prices and spend a 10-paper-clip budget across stands, then step 5 'Did the cheapest stand make the most money? ... What's the best price?' — multi-step money/pricing for K-1 (Tier 1 focus is only 'same vs. different'). *(uncertain)*

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C5 Cross-version / off-page references**
- budget min: "Paper clips as coins ... reused in Chapters 6, 8, 9 and 12"
- budget min: "Index cards — reused from Chapter 1 for price tags and menu boards; no new purchase"

**C7 Page/item references (check by hand)**
- 45 min, step 1, Done when: "Every team has a price sign standing up and its cups counted on the desk."
- 45 min, step 2, Say this: "Ten clips each. That's all the money you will get."
- 45 min, step 2, Done when: "Every stand's cup count is tallied on the board."
- 45 min, step 4, Say this: "New customers, ten clips each."
- 45 min, step 4, Done when: "Round two is tallied on the board beside round one."
- 45 min, step 5, Done when: "Cups and clips for both rounds are on the board for every team."

### Ch3 — Assembly Line vs. Solo Challenge (story: The Busy Saturday)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 20 min, step 1 [budget: both]: 20-min MATERIALS: plain paper, timer, tally sheet. Steps need a 'cutter' and 'decorator' (step 1, step 4 'cut, fold, decorate') and step 5 'Graph the data together'. Scissors and decorating supplies not in materials. Stickers/stamp pad are in both budgets; scissors only assumed on hand in lowCost, not in standard items. Missing: scissors, decorating supplies (markers/stickers/stamps), graph/chart paper.
- 30 min, step 5 [budget: both]: Step 5 'Graph the data together' — no graph paper/chart in 30-min MATERIALS or budgets. Missing: graph/chart paper. *(uncertain)*
- chapter-level [budget: standard]: Standard items include 'Recycled paper bin for the practice run', but no version has a practice run. *(uncertain)*
- all versions [budget: standard]: Standard ('From Scratch') description says 'Assumes the room has nothing. Season 1 kit already bought.' but version materials need items not in standard items: timer (20, clock covered); scissors, markers, tape or laminating film (30); scissors, rulers, markers, envelopes, stopwatches, graph paper (45). lowCost also lacks markers, envelopes, graph paper, stopwatches. Missing: scissors, rulers, markers, envelopes, stopwatches, graph paper. *(uncertain)*

**C3 Grade mismatch**
- 45 min, step 5: Say this: 'Divide the solo total by how many people' — division; 45-min can show under Tier 1 (K-1).
- 20 min, step 1: Tier 1 focus says 'Compare solo (make 1-2 items alone) vs. team (make 5-6 together)', but the K-1 20-min steps set 'make 20 bookmarks in 10 minutes' and solo 'make 5 bookmarks in 8 minutes'. Also the goal times (10 and 8 min) exceed the step durations (7 and 5 min). *(uncertain)*

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C7 Page/item references (check by hand)**
- 45 min, step 1, Say this: "Twenty bookmarks in ten minutes."
- 45 min, step 1, Done when: "Every student is standing at one station and holding the tool for that one job."
- 45 min, step 2, Done when: "The finished bookmarks are counted and the number is written on the board."
- 45 min, step 3, Say this: "Five bookmarks in eight minutes."
- 45 min, step 4, Done when: "Every student has counted their own finished bookmarks and written the number down."
- 45 min, step 5, Done when: "Both totals and a per-person number are on the board."

### Ch4 — My Family's Travel Trunk (story: Mr. Mason's Trunk)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 20 min, step 2 [budget: both]: 20-min MATERIALS: paper, crayons/markers, pencils. Step 2 'decorate their box or container' and 'maps'; step 3 'photos from home'. Box/container and world map are in both budgets (lunch bags/boxes, world map poster); photos in neither. Missing: box or container, maps, photos from home.
- 30 min, step 3 [budget: both]: Step 3 'On classroom world map, students mark (with sticky dots or pins)'. World map not in 30-min MATERIALS (it is in both budgets); sticky dots/pins in neither budget. Missing: world map, sticky dots or pins.
- 45 min [budget: both]: Before class: 'Have ten family-story prompt cards ready' — not in 45-min MATERIALS or either budget. String and pushpins (materials) are in neither budget. Missing: family-story prompt cards, string (not in budgets), pushpins (not in budgets).
- all versions [budget: standard]: Standard ('From Scratch') description says 'Assumes the room has nothing. Season 1 kit already bought.' but version materials need items not in standard items: crayons, markers, pencils (20); markers, crayons, colored pencils, scissors, stickers, fabric scraps (30); shoeboxes, fabric scraps, ribbon, string, pushpins (45). Missing: markers, crayons, scissors, fabric scraps, ribbon, string, pushpins. *(uncertain)*

**C3 Grade mismatch**
- 20 min, step 4: K-1 version asks students to 'write travel journal entries' and step 3 'List or sketch 3-5 items' — writing for K-1 (Tier 1 focus: 'Teacher scribes family stories'). *(uncertain)*
- 45 min, step 2: Item cards with 'Estimated store price vs. personal value' plus 'How it came to family' — detailed writing; 45-min can show under Tier 1.

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C5 Cross-version / off-page references**
- budget min: "Index cards — reused from Chapter 1 for the item cards; no new purchase"

**C7 Page/item references (check by hand)**
- 45 min, step 1, Done when: "Every box has a family name and at least three decorations on it."
- 45 min, step 2, Say this: "Three to five cards. ... Then two prices"
- 45 min, step 2, Done when: "Every student has at least three cards with both price lines filled."
- 45 min, step 3, Done when: "Every card is on the map with a string running back to the classroom."
- 45 min, step 4, Say this: "One or two things."
- 45 min, step 4, Done when: "Every student has presented at least one item and taken one question."

**D2 Inline dash lists:** 30 min step 2; 45 min step 1; 45 min step 2; 45 min step 3; 45 min step 4

### Ch5 — Spice Detectives: Smell, Sort & Trade (story: The Spice Market)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 20 min [budget: both]: Both budgets say 'Whole spices only, never ground: no dust, nothing to inhale'. 20-min MATERIALS list 'garlic powder' (ground) and 'vanilla'; neither is in the budget spice list. Budget list (cinnamon sticks, cloves, peppercorns, bay, star anise, cardamom, oregano, basil, rosemary, mint) also differs from 20-min's five. Missing: garlic powder, vanilla.
- 45 min [budget: both]: Budgets: 'never ground'; 45-min MATERIALS include 'Optional: Mortar and pestle for grinding demonstration'. Standard budget describes paper cups with a paper towel square over each 'so students smell without touching', but 45-min Before class says 'One jar and one spoon per station' and step 2 'Wave your hand over the jar'. Step 2 'Compare fresh vs dried versions' — budgets buy only dried/whole. Missing: spoon, jars, fresh spices. *(uncertain)*
- 20 min, step 4 [budget: lowCost]: Step 4 'Students 'trade' spice cards' and step 1 '(or pictures)'; step 3 'Create sorting chart'. Spice cards not in 20-min MATERIALS; standard budget has student-drawn trading cards, lowCost does not. Missing: spice cards, spice pictures, sorting chart.
- 30 min, step 2 [budget: both]: Step 2 'Use observation sheets'; step 3 'Create detailed sorting charts or graphs' — not in 30-min MATERIALS (only 'Paper for spice descriptions') or budgets. Missing: observation sheets, chart/graph paper. *(uncertain)*
- 45 min [budget: both]: Steps need items not in 45-min MATERIALS: step 2 'scientific observation sheets'; step 3 'Venn diagrams or multi-category charts'; step 4 'order sheet' / 'Trade to complete orders'; step 5 'research' sources for pairs; step 6 'written ranking'. None in budgets. Missing: spoon, scientific observation sheets, order sheets, chart paper, research sources (books/devices).
- all versions [budget: standard]: Standard ('From Scratch') description says 'Assumes the room has nothing. Season 1 kit already bought.' but version materials need items not in standard items: pencils (20); containers (30); market stall materials (signs, fabric), price tags, transaction tracking sheets, cinnamon ornament materials (45). Missing: pencils, fabric, transaction tracking sheets. *(uncertain)*

**C3 Grade mismatch**
- 30 min, step 4: Grades 1-3 version: 'Learn about historical spice routes and economics of scarcity'; step 3 'Sort spices ... by origin'. *(uncertain)*
- 45 min, step 4: 'Track profit. Discuss supply, demand, and scarcity'; extension profit calculation — 45-min can show under Tier 1.

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C5 Cross-version / off-page references**
- budget min: "World map, 1 printed poster — reused from Chapter 4; no new purchase"
- budget min: "Paper clips as coins — reused from Chapter 2; no new purchase"

**C7 Page/item references (check by hand)**
- 45 min, step 1, Say this: "Today it's three dollars at the shop."
- 45 min, step 1, Done when: "The route map is up and one reason spices were valuable is written on the board."
- 45 min, step 2, Say this: "Three words for each one: the color, the smell, and what it reminds you of."
- 45 min, step 2, Done when: "Every observation sheet has three words for every jar."
- 45 min, step 3, Done when: "Every group's chart is drawn with every spice placed on it."
- 45 min, step 4, Done when: "Every merchant's order sheet shows what they traded away and what they got back."
- 45 min, step 5, Say this: "Two facts and one dish."
- 45 min, step 5, Done when: "Every pair has reported a country, a spice and a dish."
- 45 min, step 6, Done when: "Every group has a written ranking with a reason on the top one."

### Ch6 — Going, Going, Gone! Classroom Auction (story: The Fish Auction)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 20 min, step 1 [budget: both]: Step 1 'Show bidding paddle' — no paddle in 20-min MATERIALS (step 3 makes paddles from scrap paper). Craft-stick paddles are in both budgets. Step 4 'Track winning bids on board'. Missing: sample bidding paddle. *(uncertain)*
- 30 min, step 4 [budget: both]: Step 4 'mystery bags' and step 5 'Graph: Actual sale prices vs. teacher's guess' — mystery bags and graph paper not in 30-min MATERIALS or budgets. Missing: mystery bags, graph/chart paper.
- 20 min [budget: both]: Budgets: 'Items to auction come from the room ... no purchase'; 20-min MATERIALS list 'small prizes' and 'stickers'. Missing: small prizes. *(uncertain)*
- chapter-level [budget: both]: Both budgets list 'Paper clips as coins', but no version uses paper clips; all versions use a scrap-paper budget card. *(uncertain)*
- all versions [budget: standard]: Standard ('From Scratch') description says 'Assumes the room has nothing. Season 1 kit already bought.' but version materials need items not in standard items: stickers, pencils, bookmarks, small prizes (20); budget tracking sheets (30); budget worksheets, auction catalog, poster board, wrapped mystery items (45). Bell is in standard only. Missing: poster board, wrapped mystery items, tracking sheets. *(uncertain)*

**C3 Grade mismatch**
- 20 min, step 4: K-1 version: 'The highest bidder crosses out the number on their budget card, writes what is left' and step 2 'Plan bidding strategy: save money for favorite item or spread out bids?' — subtraction/budgeting done by students; Tier 1 focus says 'Teacher tracks money for students'.
- 30 min, step 1: Grades 1-3: 'write $50 ... subtract each winning bid'; step 2 'How much money do you have left?' after each of 10 sales — repeated multi-step money subtraction. *(uncertain)*
- 45 min, step 6: 'Calculate: average price, highest price, lowest price' — averages; 45-min can show under Tier 1.

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C5 Cross-version / off-page references**
- budget min: "Paper clips as coins — reused from Chapter 2; no new purchase"

**C7 Page/item references (check by hand)**
- 45 min, step 1, Say this: "One hundred dollars on your card."
- 45 min, step 1, Done when: "Every budget card shows $100 and a maximum written beside at least five lots."
- 45 min, step 2, Say this: "Going once — going twice — sold to number seven."
- 45 min, step 2, Done when: "Five lots are sold and each winning price is on the chart."
- 45 min, step 3, Say this: "Five prices up there. ... Hands up if you've got less than thirty dollars left."
- 45 min, step 3, Done when: "The five prices are charted and the number of students under $30 is counted out loud."
- 45 min, step 4, Done when: "All three mystery lots are sold, opened and held up for the room."
- 45 min, step 6, Done when: "The bar graph is drawn and the highest and lowest prices are circled."

**D2 Inline dash lists:** 30 min step 1; 30 min step 2; 30 min step 4; 30 min step 5; 45 min step 1; 45 min step 2; 45 min step 3; 45 min step 4; 45 min step 5; 45 min step 6

### Ch7 — Baker's Math: Recipe Costs & Bakery Economics (story: The Family Bakery)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 20 min [budget: both]: Budgets are all paper (cardstock bases, tissue frosting) and 45 says 'Nothing here is edible', but 20-min discussion asks 'How much did our trail mix cost to make?'; 30-min discussion 'total cost for all ingredients', 'How many servings', 'cost for ONE serving'; 45 discussion 'Was any ingredient more expensive'; 45 extension 'make a batch vs. buy from store'. Tier 1 focus 'Count ingredient scoops' / 'making the recipe'. Food wording conflicts with paper simulation (discussion/focus, not steps). *(uncertain)*
- 20 min, step 2 [budget: both]: Step 2 'writes their name on the wrapper' — no pencils/markers in 20-min MATERIALS. Materials 'A large poster with the four part prices' vs budgets 'written on the board by the teacher; nothing printed'. Paper plates are in neither budget. Missing: pencils or markers, paper plates (not in budgets). *(uncertain)*
- 30 min, step 1 [budget: both]: Step 1 recipe lists 'Tissue paper $1.50 (we need 1 pack)'; tissue paper is not in 30-min MATERIALS (it is in both budgets). Calculators, bags/boxes and the price comparison card are not in either budget. Missing: tissue paper.
- 45 min, step 1 [budget: both]: Step 1 'Receive the parts cost sheet' and Before class 'Cut the parts sheets ... price on the sheet' — no parts cost sheet in 45-min MATERIALS (only cost analysis worksheets). Paper bags, labels, calculators, circle templates, markers not in either budget. Missing: parts cost sheet. *(uncertain)*
- all versions [budget: standard]: Standard ('From Scratch') description says 'Assumes the room has nothing. Season 1 kit already bought.' but version materials need items not in standard items: glue sticks or tape, paper plates, trays (20); tape, rulers, scissors, pencils, calculators, bags (30); tape, rulers, scissors, circle templates, bags, labels, calculators, markers (45). Missing: tape, glue sticks, scissors, rulers, calculators, paper bags, labels. *(uncertain)*

**C3 Grade mismatch**
- 20 min, step 3: K-1 version: 'Write on the board: 25¢ + 50¢ + 25¢ + 75¢. Students help count ... Total: $1.75' and step 4 'Should we sell it for $1.75? ... $2.50?' — four-addend cents-to-dollars money math for K-1.
- 30 min, step 3: Grades 1-3: 'Add all costs together to find TOTAL COST ... Divide total cost by pastries: COST PER ITEM' — division and multi-step money; materials say calculators 'optional, for grades 3-4'.
- 45 min, step 3: 'If each team member earned $5/hour and you worked 20 minutes, that's $1.67 in labor'; 'total cost ÷ number of pastries'; step 5 revenue minus cost = profit — 45-min can show under Tier 1.

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C7 Page/item references (check by hand)**
- 45 min, step 1, Done when: "Every team has a product, four named roles, and a guessed cost and price written down."
- 45 min, step 2, Done when: "Every team has a finished pastry and a tally of every part used, mistakes included."
- 45 min, step 3, Say this: "bag ten cents, label five, ribbon three."
- 45 min, step 3, Done when: "Every worksheet shows a total cost and a cost per item."
- 45 min, step 4, Done when: "Every team has a price tag and the because sentence written out."
- 45 min, step 5, Done when: "Every team's profit number is on the board next to its price."

**D2 Inline dash lists:** 30 min step 3; 45 min step 1; 45 min step 2; 45 min step 3; 45 min step 4; 45 min step 5

### Ch8 — The Morning Market: Fresh or Not? (story: The Morning Market)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 20 min, step 1 [budget: both]: Step 1 'Show students a banana' — real banana not in 20-min MATERIALS or budgets (budgets are cards only; 45 says 'no real food'). Missing: banana.
- 30 min, step 2 [budget: both]: Step 2 'Record what each student sells' (no recording sheet in MATERIALS); step 2 'market buyer' role; step 5 'Students count final money' — MATERIALS give only a spend-down budget card, no coins/cash. Paper clips as coins are in both budgets. Budget card '$20 ... crossed out and rewritten as it is spent' conflicts with students being sellers who earn. Missing: sales recording sheet, coins/play money. *(uncertain)*
- 45 min, step 1 [budget: both]: Before class 'count the cash out' and step 1 '$50 counted out on the desk' — no cash in 45-min MATERIALS (only a spend-down budget card); paper clips in both budgets. Step 1 Watch for 'Hold the bell' — no bell in MATERIALS or budgets. Missing: cash/coins, bell. *(uncertain)*
- all versions [budget: standard]: Standard ('From Scratch') description says 'Assumes the room has nothing. Season 1 kit already bought.' but version materials need items not in standard items: picture cards, visual labels (20); price chart, timer (30); timer with audible signals, price tracking sheets, graph paper, market stalls (45). Missing: price tracking sheets, graph paper, timer. *(uncertain)*

**C3 Grade mismatch**
- 45 min, step 5: 'calculate total revenue', 'Difference (profit/loss)', 'graph average revenue by strategy' — averages/profit-loss; 45-min can show under Tier 1.

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C5 Cross-version / off-page references**
- budget min: "Index cards — reused from Chapter 1 for the item cards and badges; no new purchase"
- budget min: "Paper clips as coins — reused from Chapter 2; no new purchase"

**C7 Page/item references (check by hand)**
- 45 min, step 1, Say this: "Fifty dollars each."
- 45 min, step 1, Done when: "Every stall has its inventory written on the sheet and $50 counted out on the desk."
- 45 min, step 2, Say this: "Fish, fruit, milk and bread are eight dollars. Everything else is five."
- 45 min, step 2, Done when: "Every seller has at least one line written in the Period 1 row."
- 45 min, step 3, Say this: "Fresh things are four dollars now."
- 45 min, step 3, Done when: "Every tracking sheet has a Period 2 row filled in, even if the line says nothing sold."
- 45 min, step 4, Say this: "Fresh is two dollars. Three minutes."
- 45 min, step 4, Done when: "The market is closed and every Period 3 row is filled."
- 45 min, step 5, Done when: "Every bar graph shows a starting value and a final revenue."

**D3 Title repeats time tag:** 20 min step 1 "Introduction (3 minutes)" next to "3 min"; 20 min step 2 "Sorting Activity (10 minutes)" next to "10 min"; 20 min step 3 "Quick Game (5 minutes)" next to "5 min"; 20 min step 4 "Discussion (2 minutes)" next to "2 min"; 30 min step 1 "Setup & Explanation (5 minutes)" next to "5 min"; 30 min step 2 "Round 1: Morning Market (7 minutes)" next to "7 min"; 30 min step 3 "Round 2: Midday Market (7 minutes)" next to "7 min"; 30 min step 4 "Round 3: Afternoon Market (7 minutes)" next to "7 min"; 30 min step 5 "Count & Compare (4 minutes)" next to "4 min"; 45 min step 1 "Market Setup (8 minutes)" next to "8 min"; 45 min step 2 "Period 1: Dawn Market (10 minutes)" next to "10 min"; 45 min step 3 "Period 2: Mid-Morning Market (10 minutes)" next to "10 min"; 45 min step 4 "Period 3: Late Morning Market (10 minutes)" next to "10 min"; 45 min step 5 "Analysis & Graphing (7 minutes)" next to "7 min"

### Ch9 — Our Community Garden Blueprint (story: La Vecina's Garden)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 20 min, step 1 [budget: both]: Step 1 'Show picture of community garden' and step 3 'Post designs around room' — picture and tape not in 20-min MATERIALS; picture in neither budget; tape only assumed in lowCost. Missing: picture of community garden, tape.
- 45 min, step 4 [budget: both]: Step 4 'Use provided data for expected harvest' and 'harvest value (at market price)' — no harvest data / market price sheet in 45-min MATERIALS or budgets; no market prices given anywhere. Missing: harvest data / market price sheet.
- chapter-level [budget: both]: Both budgets list 'Paper clips as coins', but no version uses paper clips (all use scrap-paper budget cards). *(uncertain)*
- all versions [budget: standard]: Standard ('From Scratch') description says 'Assumes the room has nothing. Season 1 kit already bought.' but version materials need items not in standard items: crayons/colored pencils, ruler (20); markers, glue sticks, magazines (30); tape measures, rulers, markers, scissors, glue, poster board, contract templates (45). Missing: markers, glue, scissors, tape measures, poster board. *(uncertain)*

**C3 Grade mismatch**
- 30 min, step 2: Grades 1-3: costs '$40 + $20 + $20 + $20' and 'Calculate: Individual: $20 buys very little; Pooled: $80-100 buys full garden'. *(uncertain)*
- 45 min, step 4: 'ROI: (Harvest value - Investment) ÷ Investment ... ROI = 100%' and step 1 '12' x 16' = 192 sq ft' — division, percent, area; 45-min can show under Tier 1.
- 45 min, step 2: Math conflict: step 2 gives 4×$30 + $20 + $10 = $150 cash plus $10 seeds + $20 tools = $180 total, but Done when says 'The pooled total is counted out loud and reaches $200'. Step 1 also says class has $180 cash (6 × $30), which differs from step 2's $150 cash.

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C5 Cross-version / off-page references**
- budget min: "Paper clips as coins — reused from Chapter 2; no new purchase"

**C6 Character names**
- Names: 20 min: La Vecina; 30 min: —; 45 min: —
- Only the 20-min version names 'La Vecina' ('Connect to La Vecina's garden story'); 30 and 45 name no character. Header 'Our Community Garden Blueprint' differs from chapter title 'La Vecina's Garden'.

**C7 Page/item references (check by hand)**
- 45 min, step 1, Done when: "The $200 breakdown and the $20 gap are both written on the board."
- 45 min, step 2, Say this: "Seeds are worth ten dollars. Tools are worth twenty."
- 45 min, step 2, Done when: "The pooled total is counted out loud and reaches $200."
- 45 min, step 3, Say this: "Each square is two feet."
- 45 min, step 3, Done when: "Every grid shows labeled plots for all members, a path, a tool space and a water point."
- 45 min, step 4, Say this: "put thirty in, get sixty back, you doubled it."
- 45 min, step 4, Done when: "Every student has written an investment, a harvest value and a return."
- 45 min, step 5, Done when: "Every group's agreement is written and signed by every member."

**D3 Title repeats time tag:** 20 min step 1 "Introduction (3 minutes)" next to "3 min"; 20 min step 2 "Individual Design (10 minutes)" next to "10 min"; 20 min step 3 "Gallery Walk (5 minutes)" next to "5 min"; 20 min step 4 "Quick Discussion (2 minutes)" next to "2 min"; 30 min step 1 "Setup & Scenario (5 minutes)" next to "5 min"; 30 min step 2 "Group Investment Decision (8 minutes)" next to "8 min"; 30 min step 3 "Garden Design (12 minutes)" next to "12 min"; 30 min step 4 "Sharing Plan (3 minutes)" next to "3 min"; 30 min step 5 "Presentation (2 minutes)" next to "2 min"; 45 min step 1 "Scenario Introduction (5 minutes)" next to "5 min"; 45 min step 2 "Investment Planning (10 minutes)" next to "10 min"; 45 min step 3 "Garden Design Phase (15 minutes)" next to "15 min"; 45 min step 4 "Return on Investment Calculation (8 minutes)" next to "8 min"; 45 min step 5 "Sharing Agreement (5 minutes)" next to "5 min"; 45 min step 6 "Gallery Walk & Reflection (2 minutes)" next to "2 min"

### Ch10 — Handmade Holiday Workshop (story: The Christmas Market)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 20 min, step 3 [budget: both]: Step 3 'using craft materials' and step 4 'Package if appropriate' — no glue/tape or packaging in 20-min MATERIALS. Glue sticks in standard, glue assumed in lowCost; packaging in neither. Missing: glue or tape, packaging. *(uncertain)*
- 30 min, step 1 [budget: both]: Step 1 'Show handmade bracelet and store-bought bracelet side-by-side' — handmade sample not in MATERIALS. Step 2 'Beaded bracelet or necklace' needs string/yarn; not in 30-min MATERIALS (yarn in both budgets). Store-bought comparison bracelet not in either budget. Missing: handmade sample bracelet, string or yarn, store-bought bracelet (not in budgets).
- 45 min [budget: both]: Before class 'Put the price list at every station'; step 1 'Show sample finished products'; step 3 prices beads, felt, ribbon, paper, glue — 45-min MATERIALS list only 'Multiple craft stations' and no craft supplies, price list or samples. Ribbon not in either budget. MATERIALS end with a dangling 'Craft Station Options:'. Missing: price list per station, sample finished products, beads, felt, ribbon, paper/cardstock, glue.
- all versions [budget: standard]: Standard ('From Scratch') description says 'Assumes the room has nothing. Season 1 kit already bought.' but version materials need items not in standard items: paper, scissors, crayons/markers, string or ribbon, timer (20); timer, pencils, store-bought sample (30); timers per station, price tags, markers, calculators, store-bought items (45). Missing: scissors, markers, ribbon, timers, calculators, store-bought comparison items. *(uncertain)*

**C3 Grade mismatch**
- 30 min, step 3: Grades 1-3: 'Our beads cost $3 for 100. You used 20 beads = about 60¢'; 'If your time is worth $6/hour and you worked 15 minutes, that's $1.50 of labor'; '60¢ + $1.50 = $2.10' — rates and decimal money.
- 45 min, step 3: 'Time spent × $6/hour (or $0.10/minute)', materials unit costs, profit — 45-min can show under Tier 1.
- tier2 min: Tier 2 focus math error: 'Round numbers for cost (60¢ materials, $1.50 labor = $2 total)' — 60¢ + $1.50 = $2.10.

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C7 Page/item references (check by hand)**
- 45 min, step 1, Done when: "Every student is at a station with a tracking sheet and a running timer."
- 45 min, step 2, Done when: "Every student has a finished item and a materials list with a number beside every line."
- 45 min, step 3, Say this: "Beads three cents. Felt twenty-five. Ribbon ten cents a foot. Paper five. Glue five. ... ten cents a minute — ten minutes is a dollar."
- 45 min, step 3, Done when: "Every sheet shows a materials total, a labor total and the two added together."
- 45 min, step 4, Done when: "Every item has a price tag showing a price above its own cost."
- 45 min, step 5, Say this: "A shop bracelet is a dollar ... Yours cost three fifty and took twelve minutes."
- 45 min, step 5, Done when: "At least three reasons a handmade thing costs more are written on the board."
- 45 min, step 6, Done when: "Every item is on the table with its price tag and every student has walked the length of it."

**D3 Title repeats time tag:** 30 min step 1 "Setup & Introduction (5 minutes)" next to "5 min"; 30 min step 2 "Craft Creation (15 minutes)" next to "15 min"; 30 min step 3 "Cost Calculation (5 minutes)" next to "5 min"; 30 min step 4 "Comparison Activity (3 minutes)" next to "3 min"; 30 min step 5 "Sharing & Reflection (2 minutes)" next to "2 min"; 45 min step 1 "Workshop Introduction (5 minutes)" next to "5 min"; 45 min step 3 "Cost Analysis (8 minutes)" next to "8 min"; 45 min step 4 "Pricing Strategy (5 minutes)" next to "5 min"; 45 min step 5 "Comparison & Discussion (8 minutes)" next to "8 min"; 45 min step 6 "Gallery Display & Reflection (4 minutes)" next to "4 min"

### Ch11 — Value Beyond Price: Memory Art Project (story: El Mercado de los Muertos)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 20 min, step 1 [budget: both]: Step 1 'Show two items: a dollar bill and a family photo' — not in 20-min MATERIALS or budgets. MATERIALS 'Simple sentence frame worksheet' vs both budgets 'The sentence frame is written on the board by the teacher; nothing printed'. Missing: dollar bill, family photo.
- 30 min, step 4 [budget: both]: Step 4 'write 2-3 sentences' — no writing paper/pencils in 30-min MATERIALS (art supplies, cardstock, museum card template). Magazines and scissors/glue sticks not in standard items. Missing: writing paper, pencils. *(uncertain)*
- 45 min, step 5 [budget: both]: Step 5 'Place sticky notes with positive messages' — sticky notes not in 45-min MATERIALS or budgets. Step 4 optional 'battery-operated candles, flowers' not in MATERIALS or budgets. Paints, pastels, canvases, frames, easels, book not in budgets. Missing: sticky notes, battery-operated candles (optional), flowers (optional).
- all versions [budget: standard]: Standard ('From Scratch') description says 'Assumes the room has nothing. Season 1 kit already bought.' but version materials need items not in standard items: crayons, markers, pencils (20); markers, magazines, glue sticks, scissors (30); paints, pastels, canvases, collage materials, frames, display materials, Day of the Dead book/images (45). Missing: crayons, markers, glue sticks, scissors, magazines, paints. *(uncertain)*

**C3 Grade mismatch**
- 45 min, step 3: Museum card 'ARTIST'S STATEMENT', 'Intrinsic value', 'Emotional value', 'Market value ... $_____', '$1,000,000' — extended writing; 45-min can show under Tier 1.

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C7 Page/item references (check by hand)**
- 45 min, step 1, Done when: "At least five different priceless things are written on the board."
- 45 min, step 2, Say this: "Twenty minutes on one piece."
- 45 min, step 2, Done when: "Every student has a piece with at least two different materials on it."
- 45 min, step 3, Say this: "Everything in a museum has a card. Title. Your name. What it's made of."
- 45 min, step 3, Done when: "Every card has a title, an artist name and the honours line filled in."
- 45 min, step 4, Say this: "Card beside the piece, not underneath it."
- 45 min, step 4, Done when: "Every piece is displayed with a readable card beside it."
- 45 min, step 5, Say this: "one note on one piece that isn't yours"
- 45 min, step 5, Done when: "Every piece has at least one note on it."

**D3 Title repeats time tag:** 20 min step 1 "Introduction (4 minutes)" next to "4 min"; 20 min step 2 "Drawing Activity (10 minutes)" next to "10 min"; 20 min step 3 "Writing Component (4 minutes)" next to "4 min"; 20 min step 4 "Sharing Circle (2 minutes)" next to "2 min"; 45 min step 1 "Cultural & Concept Introduction (7 minutes)" next to "7 min"; 45 min step 2 "Art Creation (22 minutes)" next to "22 min"; 45 min step 3 "Museum Card Creation (8 minutes)" next to "8 min"; 45 min step 4 "Gallery Setup (3 minutes)" next to "3 min"; 45 min step 5 "Gallery Walk & Reflection (5 minutes)" next to "5 min"

### Ch12 — Our Community Market Day (story: La Tamalada & The Community Market)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 20 min, step 2 [budget: both]: Step 2 'exchange money for item' and step 1 'writes $5' — no coins/money or pencils in 20-min MATERIALS (only a budget card). Paper clips as coins in both budgets. Missing: coins/play money, pencils. *(uncertain)*
- 30 min, step 1 [budget: both]: Step 1 'Repair Shop ... fix broken toys or sharpen pencils'; 'paper treats drawn and cut from card' (scissors); step 2 'make change'; step 5 'Count revenue'. Broken toys, pencil sharpener, scissors, coins not in 30-min MATERIALS. Paper clips in both budgets; card stock, broken toys, sharpener in neither. Missing: broken toys, pencil sharpener, scissors, coins.
- 45 min, step 1 [budget: both]: 45-min MATERIALS list 'paper tamales at the tamale booth', but step 1 names six booths (crafts, art, garden, paper goods, repair, trading post) with no tamale booth. Step 1 repair station 'fix broken items, sharpen pencils'; step 4 'wearing a shopper badge' and Before class 'Role badges' — only 'Market Manager' badges in MATERIALS. Receipt books, award certificates not in budgets. Missing: broken items, pencil sharpener, shopper/vendor role badges, scissors.
- chapter-level [budget: both]: Budgets: 'Inventory to sell is what students already made in Chapters 10 and 11; no purchase', but 30 and 45 also need card stock and markers for paper treats/tamales, not in either budget. Missing: card stock. *(uncertain)*

**C3 Grade mismatch**
- 30 min, step 1: Grades 1-3: price tags with 'Remember labor cost!' and step 2 'make change' from a $20 budget card. *(uncertain)*

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C5 Cross-version / off-page references**
- 20 min: "paper ornaments from CH10, drawings from CH11"
- 30 min, step 1: "Handmade Crafts (items from CH10) * Art Gallery (items from CH11)"
- 30 min, step 1: "Repair Shop (Diego-style—fix broken toys or sharpen pencils for fee)"
- 45 min: "crafts from Chapter 10, art from Chapter 11"
- 45 min, step 1: "Handmade Crafts Booth (CH10 items) ... Art Gallery (CH11 items) ... Repair & Service Station (CH05) ... Trading Post (CH01)"
- 45 min, step 2: "Perishables get discount as time passes (CH08)"
- 45 min, step 6: "tell me one thing you did today that you first learned in another chapter"
- budget min: "reused from Chapter 1 ... reused from Chapter 2 ... what students already made in Chapters 10 and 11 ... kept aside from earlier chapters"

**C6 Character names**
- Names: 20 min: —; 30 min: Diego; 45 min: —
- 'Diego' appears only in the 30-min version ('Diego-style') and in no other Season 2 chapter file; 45 labels the same repair booth '(CH05)', but Season 2 Chapter 5 is The Spice Market (no repair content) — uncertain reference, possibly another season.
- Chapter title 'La Tamalada & The Community Market': only 45-min mentions tamales (materials 'tamale booth'), and its steps have no tamale booth; 20/30 do not reference La Tamalada.

**C7 Page/item references (check by hand)**
- 45 min, step 1, Say this: "Six booths. Crafts, art, garden, paper goods, repairs and the trading post."
- 45 min, step 1, Done when: "Every booth has a sign, priced stock and a named cashier."
- 45 min, step 2, Done when: "Every booth has recorded at least one sale."
- 45 min, step 3, Done when: "Three market facts have been read out and the market is open again."
- 45 min, step 4, Done when: "Every booth has a new vendor and every former vendor is wearing a shopper badge."
- 45 min, step 5, Done when: "Every booth has Period 2 sales recorded beside Period 1."
- 45 min, step 6, Done when: "Every booth's total is on the board and every award has been read out."

**D2 Inline dash lists:** 30 min step 1; 45 min step 1; 45 min step 6

**D3 Title repeats time tag:** 20 min step 1 "Market Setup (3 minutes)" next to "3 min"; 20 min step 2 "Market Time (10 minutes)" next to "10 min"; 20 min step 3 "Sharing Circle (5 minutes)" next to "5 min"; 20 min step 4 "Quick Reflection (2 minutes)" next to "2 min"; 30 min step 1 "Market Setup (8 minutes)" next to "8 min"; 30 min step 2 "Market Round 1 (8 minutes)" next to "8 min"; 30 min step 3 "Rotation (2 minutes)" next to "2 min"; 30 min step 4 "Market Round 2 (8 minutes)" next to "8 min"; 30 min step 5 "Reflection & Celebration (4 minutes)" next to "4 min"; 45 min step 1 "Pre-Market Preparation (8 minutes)" next to "8 min"; 45 min step 2 "Market Period 1 (12 minutes)" next to "12 min"; 45 min step 3 "Mid-Market Reflection Pause (3 minutes)" next to "3 min"; 45 min step 4 "Rotation Break (2 minutes)" next to "2 min"; 45 min step 5 "Market Period 2 (12 minutes)" next to "12 min"; 45 min step 6 "Market Close & Reflection (8 minutes)" next to "8 min"


## Season 3

### Ch1 — What Can YOU Make? Skills Inventory & Dream Product (story: The Invitation Arrives)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 30 min, step 4: 'Post designs around room' needs something to hang them; not in MATERIALS or either budget. Missing: tape or pins for posting designs. *(uncertain)*
- 30 min [budget: both]: MATERIALS lists 'Colored pencils, markers' and 'Examples of maker products (photos or real items)'; neither budget has colored pencils or markers (both list crayons only). *(uncertain)*
- 45 min, Before class [budget: both]: Before class says put out 'two or three real maker objects — a painted mug, a sewn pouch, a handmade card'; both budgets supply only magazine/catalog photos of maker products, no real objects. MATERIALS lists them only as 'Optional'. Missing: real maker objects (painted mug, sewn pouch, handmade card). *(uncertain)*
- 45 min, step 4 [budget: both]: MATERIALS lists 'Timer for pitches'; neither budget lists a timer (budgets say classroom clock or teacher's phone, so covered in substance). *(uncertain)*

**C3 Grade mismatch**
- 20 min, step 2: 'Draw ONE product you wish you could make. Name it.' — naming/writing for K-1 while Tier 1 focus says 'Draw one picture ... (no text required)'. *(uncertain)*

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C7 Page/item references (check by hand)**
- 45 min, step 1, Say this: "Ten kinds of making on the board. Score yourself one to five in every single one."
- 45 min, step 1, Done when: "Every sheet has a number in all ten rows and three circled."
- 45 min, step 2, Say this: "Five ideas. Not five good ones — five. ... Then cross out four."
- 45 min, step 2, Done when: "Every sheet shows five ideas with four crossed out."
- 45 min, step 3, Say this: "Draw it from two sides, not one. Give it a name. Then three answers"
- 45 min, step 3, Done when: "Every design has a name, two drawings, a named customer and a price."
- 45 min, step 4, Done when: "Every student has pitched to a partner and at least six have pitched to the room."
- 45 min, step 5, Say this: "Then finish the line on your sheet: after today, I'm excited to make blank."
- 45 min, step 5, Done when: "Every presenter has had one compliment and every sheet's last line is filled."

**D2 Inline dash lists:** 45 min step 1; 45 min step 2; 45 min step 3; 45 min step 4; 45 min step 5

### Ch2 — Wood & Materials Explorer Lab (story: Journey to the Woodworker's Grove)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5, 6 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5, 6 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 20 min, step 1 [budget: both]: Step says 'Present 6-8 different materials (wood, cardboard, fabric, plastic, metal, foam, rubber, glass)' but MATERIALS lists 5-6 (no rubber, no glass). No glass sample in either budget; MATERIALS 'metal spoon' is also not in either budget (budgets have aluminum foil). Missing: rubber sample, glass sample.
- 20 min, step 2: Testing stations (strength weight bearing, water drops) and 'Record results on data sheets' — none of these are in the 20-min MATERIALS (budgets do list textbooks, water, index cards for data sheets). Missing: weight for strength test (textbooks), water / dropper, data sheets.
- 20 min, step 3: 'Using simple price cards' and 'Create a chart' — price cards not in MATERIALS (in standard budget only as teacher-written cards). Missing: price cards.
- 20 min, step 4 [budget: both]: 'Teams choose materials to build a simple structure ... within a budget' — no budget card in MATERIALS; no joining material (tape/glue) in MATERIALS or either budget (budgets have rubber bands only). Missing: budget card, tape or other joining material. *(uncertain)*
- 20 min, step 6: 'Write or draw' reflection — paper/pencils not in MATERIALS (budgets cover paper and pencils). Missing: paper, pencils.
- 30 min, step 1 [budget: both]: Step lists rubber and glass; MATERIALS sample list has no rubber or glass. Glass not in either budget. MATERIALS 'clay' sample and 'water dropper' are also not in either budget. Missing: rubber sample, glass sample.
- 30 min, step 3: 'Using simple price cards' / 'Create a chart' — no price cards in MATERIALS. Missing: price cards, chart paper.
- 30 min, step 4 [budget: both]: Design challenge 'within a budget' — no budget card in MATERIALS; joining material for building a bridge/container/shelter not in MATERIALS or either budget. Missing: budget card, tape or other joining material. *(uncertain)*
- 30 min, step 6: 'Write or draw' reflection — paper not in MATERIALS. Missing: paper. *(uncertain)*
- 45 min, Before class [budget: both]: 'put a towel at the water station' — towel not in MATERIALS or either budget. 'Leave the price cards face down' — MATERIALS lists a 'Material cost chart', not price cards. Missing: towel, price cards.
- 45 min, step 2: Strength (weight bearing) and water resistance (drops) testing — no weights or water in MATERIALS (budgets list textbooks and sink water). Missing: weight (textbooks), water.
- 45 min, step 1 [budget: both]: Step lists rubber and glass among the eight materials; glass not in either budget; MATERIALS only says '8-10 diverse materials'. Missing: glass sample. *(uncertain)*
- 45 min, step 4 [budget: both]: Design challenge 'You have a budget and every material costs' — no budget card in MATERIALS (standard budget lists it); no tape/joining material anywhere for building. Missing: budget card, tape or other joining material. *(uncertain)*

**C3 Grade mismatch**
- 20 min, step 3: 20-min (K-1) runs the full lab: 'Create a chart comparing properties vs. cost. Which material gives the best value for different purposes?'
- 20 min, step 4: 20-min (K-1): 'Teams choose materials to build a simple structure ... within a budget. Must justify material choices based on test results and cost.'
- 20 min, step 5: 20-min (K-1): 'Discuss trade-offs between quality and cost.'
- 20 min, step 6: 20-min (K-1): 'Why do manufacturers choose different materials for different products?' Also Tier 1 focus is 'Two-category sorting: Hard vs. Soft' but no 20-min step sorts; title 'Material Pass-Around & Sort' does not match steps.
- 30 min, step 4: 30-min (grades 1-3): 'within a budget. Must justify material choices based on test results and cost.' *(uncertain)*

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C5 Cross-version / off-page references**
- 45 min: "In the story, what materials did the friends see at the woodworker's grove?" — Discussion refers to story content; OK.

**C7 Page/item references (check by hand)**
- 45 min, step 1, Say this: "Eight materials. Before you touch any of them, write three guesses."
- 45 min, step 1, Done when: "Every student has three guesses written before any material is picked up."
- 45 min, step 2, Say this: "Four stations, three minutes each."
- 45 min, step 2, Done when: "Every data sheet has a result written at all four stations."
- 45 min, step 3, Say this: "Turn the price cards over."
- 45 min, step 3, Done when: "Every chart shows each material with a test result and a price beside it."
- 45 min, step 4, Say this: "Build one thing — a bridge, a container or a shelter."
- 45 min, step 5, Done when: "Every team has presented and the vote count is on the board."
- 45 min, step 6, Done when: "Every student has something written or drawn on the reflection line."

### Ch3 — Measure Twice, Cut Once: Precision Building Challenge (story: The Sawdust Challenge)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 45 min, step 3 [budget: both]: Say this: 'we're weighing the waste at the end' — no scale in MATERIALS or either budget; Step 4 actually measures and tallies scrap instead. Missing: scale for weighing waste. *(uncertain)*
- 45 min, step 3 [budget: both]: Build a box to spec (e.g. 5"x5"x3") needs joining; tape/glue listed only as 'Optional' in MATERIALS. Glue not in either budget; foam board (MATERIALS) not in either budget. Missing: tape (listed optional), glue. *(uncertain)*
- 45 min, step 2: 'Teams plan their cuts on paper first; ... Draw cutting diagram' — plain/scrap paper not in MATERIALS (standard budget lists cutting diagram on scrap paper). Missing: scrap paper for cutting diagram. *(uncertain)*
- 45 min, step 5: 'Graph class results' — nothing listed for the class graph (board assumed). *(uncertain)*

**C3 Grade mismatch**
- 30 min, step 5: 30-min (grades 1-3): 'If cardboard costs $1 per sheet and we wasted 30% making mistakes, we spent $0.30 extra. ... Calculate class waste.' (percent and decimal money)
- 30 min, step 4: 30-min (grades 1-3): 'Award "Precision Points" for pieces within 1/4 inch of target.' Quarter-inch measuring is Tier 3 focus. *(uncertain)*
- 30 min: 30-min materials require 'Template with exact dimensions (e.g., "Cut rectangle: 4 inches x 6 inches")' with safety scissors on cardboard; Tier 1 focus is 'Simple folding or single-cut challenges'. *(uncertain)*

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C7 Page/item references (check by hand)**
- 45 min, step 1, Say this: "Ten dollars on your card. Cardboard is two dollars a sheet."
- 45 min, step 1, Done when: "Every team has $10 written on its card and the spec copied down."
- 45 min, step 2, Done when: "Every team's cutting diagram has your approval before materials are handed out."
- 45 min, step 4, Done when: "Every structure has a measured score written on it and its scrap tallied."
- 45 min, step 5, Done when: "Every team's spend and waste percentage is on the class graph."

### Ch4 — Package Design & Branding Workshop (story: Building Boxes)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 20 min [budget: both]: MATERIALS centers on 'Brown paper bags (2 per demo, or 2 per student)'; neither budget lists paper bags (both list kraft boxes). No step uses the bags. Missing: brown paper bags (in MATERIALS, not in budgets). *(uncertain)*
- 20 min, step 1: 'Show examples of good packaging' — no packaging examples in MATERIALS or budgets. Missing: examples of good packaging.
- 20 min, step 3: 'Students draw detailed package design on paper' — paper not in MATERIALS (budgets list scrap paper). Missing: paper.
- 20 min, step 4: 'Students build simple package prototype from cardboard, paper, or recycled materials' — cardboard/recycled materials and any tape/glue not in MATERIALS (budgets: boxes, glue). Missing: cardboard or recycled materials, glue or tape.
- 30 min, step 2: 'Fold pre-scored boxes or assemble simple boxes from template' — no glue/tape in MATERIALS. Missing: glue or tape. *(uncertain)*
- 30 min [budget: both]: MATERIALS 'stickers' and 'colored pencils' are not in either budget. *(uncertain)*
- 45 min, step 2: 'Add finishing touches (ribbon, seal, thank-you note inside)' — thank-you note paper and seal not in MATERIALS (both are in budgets). Box assembly glue not in MATERIALS. Missing: paper for thank-you note, seal, glue. *(uncertain)*
- 45 min, Before class: 'decoration scraps sorted' and a pre-made plain-box vs branded-box example pair — decoration scraps not named in MATERIALS. Missing: decoration scraps. *(uncertain)*
- 45 min [budget: both]: MATERIALS 'stickers', 'stamps', 'colored pencils' not in either budget. *(uncertain)*

**C3 Grade mismatch**
- 20 min, step 2: 20-min (K-1): 'Plan: What shape? What information? What colors? How to make it attractive?'
- 20 min, step 3: 20-min (K-1): 'draw detailed package design on paper: all sides, labels, how it opens. Include product name and key information.' Tier 1 focus: 'Teacher helps with any writing'.
- 20 min, step 4: 20-min (K-1): 'build simple package prototype' — Tier 1 focus says 'Decorate pre-made bag or box (no assembly)'.
- 20 min, step 5: 20-min (K-1): 'Explain design choices: Why this shape? ... What information is important? Get peer feedback on design.' *(uncertain)*

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C5 Cross-version / off-page references**
- 20 min: "Which bag looked more special? / Would you pay more for the decorated one?" — Discussion refers to a plain-vs-decorated bag test that no 20-min step contains.

**C7 Page/item references (check by hand)**
- 45 min, step 1, Done when: "Every student has a name, a tagline, a logo and two named colors on the page."
- 45 min, step 2, Done when: "Every box is assembled with brand marks on all visible sides and one finishing touch inside."
- 45 min, step 3, Say this: "Now write three prices: the thing on its own, the thing in a plain box, the thing in your box."
- 45 min, step 3, Done when: "Every sheet shows all three prices and a total packaging cost."
- 45 min, step 4, Done when: "Every presenter has taken a show-of-hands vote from the class."

### Ch5 — Clay Creations Workshop (story: The Potter's Valley)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5, 6 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- chapter-level [budget: lowCost]: lowCost description 'Identical to From Scratch' but its item list differs (omits quality rating sheet, clock, cost figures; adds glue). *(uncertain)*
- 20 min, step 1: 'Review clay safety: wet hands' — no water in MATERIALS (budgets list sink water). Missing: water.
- 20 min, step 4: 'texture with tools, carved patterns' — no tools in MATERIALS (budgets list craft sticks). Missing: shaping tools (craft sticks).
- 20 min, step 4 [budget: both]: 'Prepare for drying' while MATERIALS says playdough; budgets supply air-dry clay. Playdough is not in either budget. Missing: playdough (in MATERIALS, not in budgets). *(uncertain)*
- 30 min, step 1 [budget: both]: 'Examine different clay types' — only one clay in MATERIALS and budgets. Missing: samples of different clay types.
- 30 min, step 2: 'stamp texturing' — no stamps in MATERIALS or budgets (straws listed for texture). Missing: stamps. *(uncertain)*
- 30 min [budget: both]: MATERIALS 'wax paper', 'plastic knives', 'straws' not in either budget. *(uncertain)*
- 45 min, step 2: 'track time' — no timer/clock in MATERIALS (standard budget lists clock; lowCost does not). Missing: clock or timer.
- 45 min, Before class: 'Cover the desks' — no desk covering in MATERIALS (budget paper plates are work surfaces). Missing: desk covering. *(uncertain)*
- 45 min [budget: both]: MATERIALS 'sponges' not in either budget. Missing: sponges (in MATERIALS, not in budgets). *(uncertain)*

**C3 Grade mismatch**
- 30 min, step 4: 30-min (grades 1-3): 'Calculate the value of skill — your hands and knowledge turned cheap clay into something valuable.' *(uncertain)*
- 30 min: 30-min discussion: 'If clay costs $1 but a skilled potter spends an hour making a beautiful bowl, what should they charge?' (labor-rate reasoning) *(uncertain)*

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C5 Cross-version / off-page references**
- 30 min: "Did your second attempt turn out better than your first?" — 30-min steps have one creation project; no second attempt on the page. *(uncertain)*

**C7 Page/item references (check by hand)**
- 45 min, step 1, Say this: "Three ways to make a pot. ... Four minutes each."
- 45 min, step 1, Done when: "Every student has a rough attempt at all three techniques sitting in front of them."
- 45 min, step 2, Say this: "Pick one. Make three. Number them one, two, three"
- 45 min, step 2, Done when: "Every student has three numbered pieces with a time written for each."
- 45 min, step 3, Say this: "Score all three out of ten."
- 45 min, step 3, Done when: "Every piece has a written score and a measurement beside it."
- 45 min, step 4, Say this: "So why is number three worth more than number one?"
- 45 min, step 4, Done when: "A reason the value went up with no change in materials is written on the board."

### Ch6 — Design Upgrade: Adding Value Through Decoration (story: Throwing and Turning)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- chapter-level [budget: lowCost]: lowCost description 'Same list' but lowCost item list is shorter (omits demo items, time log paper, survey cards, clock). *(uncertain)*
- 20 min [budget: both]: MATERIALS 'paint pens' and 'wooden spoons' not in either budget. *(uncertain)*
- 30 min, step 2: 'Sketch quick design plan' — no paper in MATERIALS. Missing: paper.
- 30 min [budget: both]: MATERIALS 'stamps' and 'ribbons' not in either budget (standard has sticker and stamp sheets; ribbon absent). *(uncertain)*
- 45 min, Before class: 'three-stage example ... the raw material, the plain item, the decorated one, labeled one dollar, five dollars, twenty-five' — raw material sample and labels not in MATERIALS. Missing: raw material sample (clay lump), price labels.
- 45 min, step 2 [budget: both]: 'look at professional decorated pottery/items (examples or photos)' and 'plan yours on paper' — neither examples/photos nor paper in MATERIALS; examples not in budgets. Missing: professional decorated examples or photos, paper.
- 45 min, step 3 [budget: both]: 'Take "before" and "after" photos' — MATERIALS lists 'Before/after photography setup' but no camera in either budget. Missing: camera (not in budgets). *(uncertain)*
- 45 min [budget: both]: MATERIALS 'acrylic paint, fine brushes, ... gold leaf/metallic accents' vs budgets' washable tempera and standard brushes. *(uncertain)*

**C3 Grade mismatch**
- 30 min: 30-min (grades 1-3) discussion: 'If decoration took 15 minutes, and you charge $10 per hour for your time, decoration costs $2.50. If you can now charge $8 more, is that a good deal?' (hourly labor rate)
- 30 min, step 4: 30-min: 'Write "after" price. Calculate value added.' *(uncertain)*
- 45 min, step 4: Outside check scope, factual: formula reads 'Calculate profit margin: (price cost) / price = margin %' — minus sign missing.

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C5 Cross-version / off-page references**
- 20 min: "clay items from CH5" — MATERIALS cross-chapter reference; OK.
- 30 min: "clay from previous session" — MATERIALS cross-session reference; OK.
- 45 min: "ideally pottery from CH5" — MATERIALS cross-chapter reference; OK.
- 45 min, step 2: "You need that number two steps from now." — Within-version reference to Step 4; OK.

**C7 Page/item references (check by hand)**
- 45 min, step 1, Done when: "The three prices and at least two reasons for the jump are on the board."
- 45 min, step 2, Done when: "Every plan shows a drawn design, named techniques and an estimated time."
- 45 min, step 3, Done when: "Every piece is decorated and an actual time is written beside the estimate."
- 45 min, step 4, Say this: "Now go and ask five people what they'd pay."
- 45 min, step 4, Done when: "Every piece has a cost, a survey result and a final price written down."

**D2 Inline dash lists:** 45 min step 1; 45 min step 2; 45 min step 3; 45 min step 4

### Ch7 — Transformation Lab: Heat, Mix & Change (story: The Kiln's Secret)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5, 6 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5, 6 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 20 min, step 3 [budget: both]: Stations: 'weaving strips into placemats, mixing sorted beads and buttons into craft kits, assembling parts into simple structures' — none in 20-min MATERIALS; 'parts for simple structures' not in either budget. Missing: paper strips, beads and buttons, parts for simple structures, envelopes/cord for craft kits.
- 20 min, step 4: 'calculate: raw material cost vs. finished product value' — no cost cards/figures in MATERIALS. Missing: cost cards or price figures. *(uncertain)*
- 30 min, step 1: Demo includes 'folding paper into origami' — no paper squares in 30-min MATERIALS (budgets have them). Missing: scrap paper squares for origami.
- 30 min, step 3 [budget: both]: 'assembling parts into simple structures' — no parts in MATERIALS or either budget. MATERIALS 'stirring sticks' not in either budget. Missing: parts for simple structures.
- 45 min, Before class [budget: both]: 'Sort the beads and buttons into trays' — trays not in MATERIALS or budgets; beads/buttons, ice not named in MATERIALS ('Multiple transformation stations' only). Missing: trays, beads and buttons, ice and bowl of water.
- 45 min, step 1: Demos (ice, two paint colors, origami paper) not named in 45-min MATERIALS. Missing: ice and bowl, two colors of washable paint, scrap paper squares. *(uncertain)*
- 45 min, step 3 [budget: both]: 'Weave it, mix it, build it' — paper strips, beads/buttons, build parts not named in MATERIALS; build parts not in either budget. Missing: paper strips, beads and buttons, parts for simple structures.
- 45 min, step 4: Watch for: 'The numbers are on the cards' — no cost cards in 45-min MATERIALS (lists 'Cost analysis worksheets'). Missing: raw-cost cards.

**C3 Grade mismatch**
- 20 min, step 4: 20-min (K-1): 'For each station, calculate: raw material cost vs. finished product value. How much did transformation add?'
- 20 min, step 5: 20-min (K-1): 'Groups research one everyday item (t-shirt, juice box, pencil) and map its transformation from raw materials. Present the chain to class.'
- 20 min, step 6: 20-min (K-1): 'Write or discuss: Why does a wooden table cost more than a pile of lumber?' *(uncertain)*
- 30 min, step 4: 30-min (grades 1-3): 'calculate: raw material cost vs. finished product value' *(uncertain)*

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C7 Page/item references (check by hand)**
- 45 min, step 1, Say this: "Watch three things change."
- 45 min, step 1, Done when: "All three demos have a worth-more or worth-less vote recorded on the board."
- 45 min, step 2, Say this: "Wheat, flour, bread, sandwich. Four steps."
- 45 min, step 2, Done when: "The four-stage chain is drawn on the board with a price at each stage."
- 45 min, step 3, Say this: "Three stations."
- 45 min, step 3, Done when: "Every student has a finished item from each station with a time written on it."
- 45 min, step 4, Done when: "Every station row shows a raw cost, a finished value and the difference between them."
- 45 min, step 5, Done when: "Every group has a chain of at least four stages drawn and presented."
- 45 min, step 6, Done when: "Every student has written an answer to both questions."

### Ch8 — Invention Challenge: Solve a Real Problem (story: The Inventor's Tower)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 30 min [budget: both]: Title 'Design Thinking Process with Prototype', MATERIALS and both budgets supply prototype stock, but no 30-min step builds a prototype (steps identical to 20-min). *(uncertain)*
- 30 min, step 1: 'List them on paper' / sketch — pencils not in 30-min MATERIALS. Missing: pencils. *(uncertain)*
- 30 min [budget: both]: MATERIALS 'straws, cups' not in either budget. *(uncertain)*
- 45 min, step 2: 'Use rulers for straight lines' — rulers not in 45-min MATERIALS (in budgets). Missing: rulers.
- 45 min [budget: both]: MATERIALS 'scissors' and 'markers' not in either Chapter 8 budget. *(uncertain)*

**C3 Grade mismatch**
- 20 min, step 1: 20-min (K-1): 'Each student finds 2-3 problems. List them on paper.' Tier 1 focus: 'Verbal explanation instead of written'.
- 20 min, step 3: 20-min (K-1): 'Label the parts. Write one sentence: My invention solves _____.' *(uncertain)*

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C5 Cross-version / off-page references**
- 30 min: "How did interviewing help you understand the problem?" — 30-min discussion refers to interviewing; no 30-min step includes interviews.

**C7 Page/item references (check by hand)**
- 45 min, step 1, Say this: "Five of them on the board, then we vote."
- 45 min, step 1, Done when: "At least five problems are on the board and three are circled by class vote."
- 45 min, step 2, Done when: "Every blueprint has labeled parts and a materials list on it."
- 45 min, step 4, Say this: "Four things in thirty seconds."
- 45 min, step 5, Done when: "Every inventor has pitched, taken a question and had the vote counted."

### Ch9 — Blueprint Your Product: From Idea to Plan (story: Blueprint Dreams)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 45 min [budget: both]: Standard 'One pad of graph paper. The rest is already in the kit'; lowCost 'Nothing else is needed' — but 45-min MATERIALS need protractors, compasses, 11x17 blueprint paper, blueprint templates with title blocks, and a materials cost reference sheet, none in either budget. Missing: protractors, compasses, 11x17 paper, blueprint templates, materials cost reference sheet.
- 30 min [budget: both]: MATERIALS 'graph paper (3 sheets per student)' — 3 x 20 students = 60 sheets vs budget pad of 50 sheets. *(uncertain)*
- 20 min, step 1: 'Look at simple blueprint examples' — not in 20-min MATERIALS (budget lists one real blueprint). Missing: blueprint example.
- 20 min, step 3: 'draw detailed blueprint on grid paper' — 20-min MATERIALS lists 'Plain paper'; grid paper not listed (in budgets). Missing: grid/graph paper.
- 30 min, step 1: 'Study professional blueprints' — not in 30-min MATERIALS. Missing: professional blueprint examples.
- 30 min, step 4 [budget: both]: 'Research prices if possible' — no price reference in MATERIALS or budgets. Missing: price reference. *(uncertain)*
- 45 min, Before class: 'Scrap paper for the rough sketch' (also Step 2 'Sketch rough concept on scrap paper') — scrap paper not in MATERIALS (budget paper covers). Missing: scrap paper.

**C3 Grade mismatch**
- 20 min, step 3: 20-min (K-1): 'draw detailed blueprint on grid paper: top view, side view, measurements. Label all parts, materials' — Tier 1 focus is 'Single view drawing (front only)'.
- 20 min, step 2: 20-min (K-1): 'Plan all details: size, materials needed, steps to build it, special features. List materials and tools required.'
- 30 min, step 4: 30-min (grades 1-3): 'create detailed materials list: what's needed, quantities, estimated costs ... Calculate total material cost.'
- 30 min, step 3: 30-min: 'multi-view blueprint ... front view, side view, top view. Add precise measurements' (Tier 3 focus). *(uncertain)*
- chapter-level: Tier 1 focus 'Focus on using ruler to draw straight lines' / 'Simple measurements (length and width only)' — ruler reading for K may be hard. *(uncertain)*

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C5 Cross-version / off-page references**
- 20 min, step 2: "from earlier activities or new idea" — Vague earlier-activity reference; OK.
- 45 min, step 2: "invention from CH8" — Cross-chapter reference; OK.

**C7 Page/item references (check by hand)**
- 45 min, step 1, Done when: "Four blueprint elements are named and listed on the board."
- 45 min, step 2, Done when: "Every student has a rough sketch and a written parts list."
- 45 min, step 3, Say this: "Three drawings of one thing. From the front. From the side. From above."
- 45 min, step 3, Done when: "Every sheet has three labeled views with measurements on each."
- 45 min, step 4, Done when: "Every diagram shows numbered parts with assembly arrows."
- 45 min, step 5, Done when: "Every list has a cost per part and a total at the bottom."
- 45 min, step 6, Done when: "Every sheet has numbered steps with a time on each and a total."
- 45 min, step 7, Done when: "Every blueprint has written feedback from a partner on it."

### Ch10 — Would You Buy This? Survey & Market Research (story: The Maker's Market Research)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5, 6 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 30 min [budget: both]: Budgets say 'A hardback book to lean on ... No clipboard needed' but 30-min MATERIALS list 'Clipboards or hard surface for writing'. *(uncertain)*
- 45 min [budget: both]: Budgets say 'No clipboard needed' but 45-min MATERIALS list 'Clipboards'. MATERIALS 'Graph paper or printed graph templates' and 'Colored pencils/markers' not in either Chapter 10 budget. Missing: clipboards (in MATERIALS, budget says not needed).
- 20 min, step 2: MATERIALS 'Simple survey template (1 question pre-printed)' but step has students 'create 3-5 simple survey questions' — no blank paper for writing questions listed (only 'Paper for tallying'). Missing: paper for writing questions. *(uncertain)*
- 20 min, step 4: 'Create simple chart or graph' — nothing listed for graphing. *(uncertain)*

**C3 Grade mismatch**
- 20 min, step 2: 20-min (K-1): 'Students create 3-5 simple survey questions ... How much would you pay? What features matter most?' Tier 1 focus: 'Single yes/no question surveys'.
- 20 min, step 3: 20-min (K-1): 'Try to survey at least 5 people. Write down what they say.'
- 20 min, step 4: 20-min (K-1): 'What's the most common suggested price? ... Create simple chart or graph showing results.'
- 30 min, step 4: 30-min (grades 1-3): 'Create simple bar graph showing results (how many yes/no, price preferences).' (survey with graph) *(uncertain)*

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C7 Page/item references (check by hand)**
- 45 min, step 1, Done when: "Every student has a sketch, a name, a price and a written prediction."
- 45 min, step 2, Say this: "Five to seven questions."
- 45 min, step 2, Done when: "Every survey has at least five questions tested on a partner."
- 45 min, step 3, Say this: "Ten to fifteen people."
- 45 min, step 3, Done when: "Every data sheet has at least ten responses recorded."
- 45 min, step 4, Done when: "Every student has a bar graph with their prediction written beside the actual result."
- 45 min, step 6, Say this: "One page. The idea, the graph, what you found out, what you changed."
- 45 min, step 6, Done when: "Every report page has all four parts filled in."

### Ch11 — Production Day: Build Your Product for Real (story: The Creation Workshop)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 45 min [budget: both]: Standard 'One pack of construction paper. The template is photocopied'; lowCost 'Everything else is in the room' — 45-min runs on posted-cost cardboard, tape, markers and 'Production role badges', and builds from Chapter 9 blueprints rather than the photocopied template. Cardboard, tape, markers, badges not in either budget. Missing: cardboard, tape, markers, role badges.
- 45 min, step 3: 'Timer running' — timer not in 45-min MATERIALS (in budgets). Missing: timer.
- 45 min, step 5 [budget: both]: 'Complete Production Report form' — not in MATERIALS or budgets. Missing: Production Report form.
- 45 min, Before class: 'Pull the Chapter 9 blueprints out' — not in MATERIALS ('Production blueprint/plan sheets' listed). Missing: Chapter 9 blueprints. *(uncertain)*
- 20 min, step 1: 'Review product plans from earlier lessons' / Step 2 'Follow blueprints or plans' — no plans in MATERIALS. MATERIALS 'cardboard, tape' not in either budget. Missing: earlier product plans/blueprints.
- 30 min, step 1: 'Review product blueprints and materials lists' — not in MATERIALS. Missing: product blueprints.
- 30 min, step 2: 'Measure carefully' — no rulers in MATERIALS or either budget. Missing: rulers.
- 30 min, step 3 [budget: both]: 'sand rough edges, secure loose parts, add protective coating if applicable' — sandpaper and coating not in MATERIALS or either budget. Missing: sandpaper, protective coating.
- 30 min [budget: both]: MATERIALS 'tape, markers, stickers' not in either budget. *(uncertain)*

**C3 Grade mismatch**
- 20 min, step 4: 20-min (K-1): 'How does handmade compare to factory-made?' *(uncertain)*

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C5 Cross-version / off-page references**
- 20 min, step 1: "Review product plans from earlier lessons." — Cross-lesson reference; OK.
- 30 min: "Which role was hardest? Which was fastest? / Did dividing the work help or make it harder?" — 30-min title says 'with Role Assignment' but no 30-min step assigns roles; discussion refers to content not on the page.
- 20 min: "Did going fast make them better or worse? / What would you change if you made more tomorrow?" — 20-min steps build one planned product with no speed/quantity element. *(uncertain)*
- 45 min, Before class: "Pull the Chapter 9 blueprints out" — Cross-chapter; OK.
- 45 min, step 1: "from blueprints created in CH9" — Cross-chapter; OK.
- 45 min: "How is this like the friends' experience in the workshop?" — Story reference; OK.

**C7 Page/item references (check by hand)**
- 45 min, step 1, Say this: "Four jobs."
- 45 min, step 1, Done when: "Every group has four named roles and a written estimate of quantity and time."
- 45 min, step 2, Say this: "Write your budget at the top of the sheet."
- 45 min, step 2, Done when: "Every group has a budget written down and a purchase list with prices."
- 45 min, step 3, Done when: "Every group has finished items, a materials tally and a time per item."
- 45 min, step 4, Say this: "Two piles. Approved, and needs work."
- 45 min, step 4, Done when: "Every group's items are sorted into two counted piles."
- 45 min, step 5, Done when: "Every Production Report shows planned against actual for both count and time, plus a cost per approved item."

### Ch12 — Our Makers' Faire: Season Showcase & Sale (story: The Makers' Faire)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5, 6 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 45 min, step 2 [budget: both]: 'Teacher "cuts ribbon" to open the faire' — ribbon and scissors not in MATERIALS or either budget. Missing: ribbon, scissors.
- 45 min, step 3 [budget: both]: Watch for: 'Ring a bell at four minutes' — bell and timer not in MATERIALS or either budget. Missing: bell, timer.
- 45 min, step 1: 'Arrange sales log and "cashbox" area' — no cashbox/container in MATERIALS or budgets; Watch for 'Stack a book under one item'. Missing: cashbox container, book. *(uncertain)*
- 45 min, step 6 [budget: both]: 'Present certificates' — MATERIALS lists certificates; neither budget does. Missing: certificates (not in budgets).
- 30 min [budget: both]: MATERIALS 'Index cards for price tags' and 'Display materials (fabric scraps, small boxes)' not in either Chapter 12 budget. *(uncertain)*
- 20 min, step 2: 'create signs with product names and prices, make labels' — sign/label stock not in 20-min MATERIALS (budgets list cardstock). Missing: cardstock or paper for signs and labels. *(uncertain)*
- 20 min: MATERIALS lists 'Paper clips as $1 tokens, 50 per shopper' but no 20-min step uses tokens or selling. If all 20 students shop, 50 each = 1,000 clips vs budget box of 500. *(uncertain)*

**C3 Grade mismatch**
- 30 min, step 5: 30-min (grades 1-3): 'Count the tokens collected. If using costs: subtract material costs (from earlier activities) to find profit.'
- 30 min, step 3: 30-min: 'Make purchasing decisions, practice counting change' with 50 $1 tokens. *(uncertain)*

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C5 Cross-version / off-page references**
- 45 min, Before class: "check the value matches the 45-minute plan: this version uses $10 tokens, not $1" — Implicit cross-version reference to the $1 tokens in the 20/30-min versions.
- 20 min: "Did you sell your items? How did it feel? / What did you learn about selling?" — 20-min steps contain no selling; discussion refers to content not on the page.
- 30 min, step 5: "subtract material costs (from earlier activities)" — Cross-chapter; OK.
- 45 min: "How did the market research from CH10 help you know what to make?" — Cross-chapter; OK.
- 45 min: "student-made items from S3 chapters" — MATERIALS cross-chapter; OK.

**C7 Page/item references (check by hand)**
- 45 min, step 1, Say this: "Your booth needs four things. A sign with your name. A price on everything. A story card"
- 45 min, step 1, Done when: "Every booth has a sign, priced items, a story card and a cash area."
- 45 min, step 3, Say this: "Ten dollars a token, and you're carrying about a hundred."
- 45 min, step 3, Done when: "Every booth's sales log has at least one line and every shopper has spent or decided not to."
- 45 min, step 4, Done when: "Every booth has a new seller and Period 2 sales are being logged."
- 45 min, step 5, Done when: "Every Business Report shows revenue, material cost and profit."
- 45 min, step 6, Say this: "Six awards, and only one of them is about money."
- 45 min, step 6, Done when: "All six certificates have been read out and handed over."


## Season 4

### Ch1 — Solo Challenge: Can You Do It All Alone? (story: Going Solo)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 20 min, step 3: Step 1/3 task 'Stack 10 books tallest to shortest' uses books; 20-min MATERIALS lists 'organizing supplies (blocks or crayons)' and no books. Books ARE in both budgets ('Ten books from the classroom shelf'). Missing: 10 books.
- 20 min, step 1: Step 1 task 'Write name in bubble letters' needs a pencil/crayon/marker; MATERIALS lists drawing paper only (crayons appear only as organizing supplies). Pencils and crayons are in both budgets. Missing: pencils or crayons for writing. *(uncertain)*
- 30 min, step 1: Step 1 says '5 tasks to complete independently' and step 3 'remaining 2 tasks' (3+2), but MATERIALS lists only '4 task stations'. Fifth task has no listed materials. Missing: fifth task station materials. *(uncertain)*
- 45 min, Before class: Before class says 'Build the seven task cards' and step 1-2 use '7 tasks'/'all seven task cards'; MATERIALS lists '5 task stations' and no task cards. Task cards not named in either budget (only paper). Missing: seven task cards, materials for tasks 6 and 7.
- 45 min, Before class: Before class mentions a student hunting for 'scissors' (as an example); scissors not in MATERIALS or either budget. Missing: scissors. *(uncertain)*
- 45 min, step 3: Before class 'Have a visible clock the whole room can see'; no clock/timer in 45-min MATERIALS. Clock is in both budgets. Missing: visible clock/timer.

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C5 Cross-version / off-page references**
- 30 min, Discussion: "How much more did we produce as a team?" — 30-min steps contain no team round; refers to content not on this page *(uncertain)*
- 45 min, Discussion: "Who made more money working solo or in partnership? Why?" — 45-min steps have no partnership round or earnings; content not on page *(uncertain)*
- 45 min, Discussion: "How did your stress level change between rounds?" — No second round in 45-min steps *(uncertain)*
- 45 min, Extensions: "Connect to Season 3: "At the Makers' Faire, did the friends work alone or together? How did that help?"" — cross-season reference

**C7 Page/item references (check by hand)**
- 45 min, step 1, Done when: "Every student has all seven task cards in front of them and the clock is showing."
- 45 min, step 2, Done when: "Every student has all seven tasks numbered in an order on paper."
- 45 min, step 4, Done when: "Every student's card list shows which tasks are done and which are not."
- 45 min, step 5, Say this: "How many did you finish out of seven? Hands up for seven. Six. Five."
- 45 min, step 5, Done when: "The class chart shows a completion count for every one of the seven tasks."

### Ch2 — Write Your Mini Business Plan (story: The Business Plan)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 45 min, Before class [budget: both]: Before class 'Print a real one-page business plan to hold up'; step 1 Watch for 'Point at the money section on the real one you brought'. Not in 45-min MATERIALS and not in either budget. Missing: printed real one-page business plan.
- 45 min [budget: both]: 45-min MATERIALS lists 'Calculators' and 'Chart paper or poster board'; neither budget lists calculators (standard gives 'Whiteboard hundreds chart as the math support') or chart paper/poster board. Standard description says 'The plan is written on plain paper'. *(uncertain)*
- 30 min, step 4 [budget: both]: 30-min MATERIALS 'Simple calculator or hundreds chart'; no calculator in either budget (hundreds chart only in standard). *(uncertain)*

**C3 Grade mismatch**
- 20 min, step 4: 20-min (K-1): 'Write 2-3 sentences explaining the business' plus a written business plan template ('Business name, what you sell, who will buy it, price, materials needed') - written business plan / long writing for K-1.
- 20 min, step 3: 20-min (K-1): 'Decide on price: How much would you charge? Why that amount? Is it fair?' *(uncertain)*
- 30 min, step 4: 30-min (grades 1-3): 'calculate: cost to make product, selling price, profit per item, how many sales needed to break even. Create simple financial forecast.'
- 30 min, step 3: 30-min (grades 1-3): 'complete comprehensive business plan: product description, target customers, pricing strategy with justification, materials list with costs, expected profit, competition analysis.'
- 30 min, step 2: 30-min (grades 1-3): 'What's the competition?' / 'Market Research' step title *(uncertain)*

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C5 Cross-version / off-page references**
- 45 min, Discussion: "What could go wrong if you DON'T make a plan first?" (Connect to Benny's mistake in CH1)" — cross-chapter reference; S4 Ch1 page names Riley and Ellis, not Benny

**C6 Character names** *(uncertain)*
- Names: 20 min: Mr. Mason; 30 min: Layla; 45 min: Mr. Mason, Layla, Benny
- 45 discussion credits a 'mistake in CH1' to Benny, but the S4 Chapter 1 page's story references name Riley (remaking mugs) and Ellis (walking across town), never Benny. Possible wrong name or a reference to another season's Chapter 1. (uncertain)

**C7 Page/item references (check by hand)**
- 45 min, step 1, Done when: "The sections of a business plan are listed on the board."
- 45 min, step 2, Done when: "Every student has written responses from at least five people."
- 45 min, step 4, Done when: "Every plan shows itemized costs, a price, a margin and a break-even number."
- 45 min, step 5, Say this: "Pull it together into one document, in order. Summary at the top, even though you write it last."
- 45 min, step 5, Done when: "Every plan has all five sections present with nothing blank."
- 45 min, step 6, Done when: "Every plan has written feedback from at least one other person on it."

### Ch3 — Grand Opening: Run a Classroom Store (story: Open for Business)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5, 6 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 20 min, step 1: Step 1 'Set up store area with items and price tags'; price tags not in 20-min MATERIALS. Price-tag cards are in both budgets (cardstock). Missing: price tags.
- 20 min, step 3: Step 3 'How many clips did the register take in?'; no register box in 20-min MATERIALS. Register box/tray is in both budgets. Missing: register box/tray.
- 20 min, step 2 [budget: both]: Step 2 'Each customer starts with 10 clips'; both budgets say '20 to 30 per customer'. Quantity mismatch, not a contradiction. *(uncertain)*
- 45 min, step 1: Step 1 'Set up 4 departments with clear signage' / Done when 'Four departments are signed'; no department signs in 45-min MATERIALS. Signs are in standard (cardstock department signs) and lowCost. Missing: department signs.

**C3 Grade mismatch**
- 20 min, step 2: 20-min (K-1): 'being cashier (taking clips, counting out change)' - making change; Tier 1 focus has no change-making (Tier 2 introduces it 'with teacher guidance').
- 30 min, step 2: 30-min (grades 1-3): 'Practice giving change in tokens' with prices '$10-15', and step 5 'Total all transactions from logs' - multi-item addition to $15+ with change-making. *(uncertain)*

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C7 Page/item references (check by hand)**
- 45 min, step 1, Say this: "Look at your tags — there's a price on the front and a cost on the back."
- 45 min, step 1, Done when: "Four departments are signed and every role has a named student."
- 45 min, step 2, Done when: "The transaction log has a price, a cost and a profit on every line."
- 45 min, step 3, Say this: "Hand them the log."
- 45 min, step 3, Done when: "The register total is written down and agreed by both shifts."
- 45 min, step 4, Done when: "The log is still being filled and every department has a staffed counter."
- 45 min, step 6, Done when: "The best department and at least three unsold items are named on the board."

### Ch4 — Customer Service Role-Play Challenge (story: The Unhappy Customer)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5, 6 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 30 min, step 3 [budget: standard]: Standard budget item says scenarios are 'read aloud by the teacher from the instructor guide — no cards needed'; 30-min step 3 'Customer reads their complaint from card' and step 4 'New scenario card' require scenario cards (listed in MATERIALS: '6 scenario cards'). lowCost also says scenarios are read aloud by teacher. Missing: scenario cards (not in either budget).
- 45 min, Before class [budget: standard]: Standard says 'no cards needed'; 45-min Before class 'Have the harder round-two scenarios written on cards, face down'. Cards not in either budget. Missing: scenario cards (not in either budget).
- 20 min [budget: standard]: 20-min MATERIALS lists '3 pre-written scenario cards' while standard budget says 'no cards needed' (20-min steps themselves have teacher read aloud, consistent with budget). *(uncertain)*
- 45 min, Before class [budget: both]: Before class 'Print the observer rubric'; step 7 'Certificates' for awards. Standard description 'Nothing bought... the rest is paper'. Printed rubric and certificates are in MATERIALS but not in either budget. Missing: printed rubric (not in budgets), certificates (not in budgets). *(uncertain)*
- 45 min, step 3: Watch for 'Give them the sheet and a pen'; 45-min MATERIALS has no pens/pencils. Pencils in both budgets; pens in neither. Missing: pen/pencils.

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C7 Page/item references (check by hand)**
- 45 min, step 1, Done when: "The one-becomes-ten picture is on the board with a dollar figure beside it."
- 45 min, step 2, Done when: "The three L's are on the board and both versions have been acted out."
- 45 min, step 3, Say this: "One complains, one runs the business, one watches with the sheet."
- 45 min, step 3, Done when: "Every group has three completed rubric sheets, one per role rotation."
- 45 min, step 4, Done when: "Every group has scored all three of the harder scenarios."
- 45 min, step 5, Done when: "Every worksheet has all the scenarios calculated, including the lost-future-business one."
- 45 min, step 7, Say this: "Certificates from the observer scores, not from me."
- 45 min, step 7, Done when: "Certificates are handed out and all three class votes are counted."

### Ch5 — Competing Businesses: Differentiation Game (story: The Competition)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 20 min, step 1 [budget: both]: Step 1 stores sell 'the same items (pencils, erasers, bookmarks)'; 20-min MATERIALS goods are 'paper bookmarks, stickers, or drawings' and both budgets give only student-made paper bookmarks as goods. Pencils/erasers not listed. Missing: pencils, erasers.
- 30 min, step 1 [budget: both]: Same as 20-min: step 1 sells 'pencils, erasers, bookmarks'; not in 30-min MATERIALS (paper menus, drawn items) or budgets' goods. Missing: pencils, erasers.
- 30 min, step 1: Title 'Four Businesses' and MATERIALS '4 team stations', but step 1 'Divide class in half. Each side is a store' (two stores). *(uncertain)*
- 20 min, step 1: Step 1 'Both stores set same prices' - no price signs/cards in 20-min MATERIALS. Index-card price signs are in both budgets. Missing: price signs. *(uncertain)*
- 45 min, step 1 [budget: both]: Step 1 / Before class / Done when: 'an empty cup for the paper clips' per team; cups not in 45-min MATERIALS or either budget. Missing: cups (one per team).
- 45 min, step 1 [budget: both]: Step 1 '6-8 competing businesses'; MATERIALS '4 team stations' and standard budget 'Two to four desks or tables'. *(uncertain)*
- 45 min, step 5: Step 5 'Calculate profit/loss for each round' needs item costs; no cost figures/cost sheet in MATERIALS or budgets. Missing: item cost information. *(uncertain)*

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C5 Cross-version / off-page references**
- 20 min, Discussion: "In Round 1, why did both stores end up making almost no money?" — 20-min has one shopping round with no price changes; Round 1/Round 2 exist only in 45-min *(uncertain)*
- 20 min, Discussion: "In Round 2, did price matter as much? What else mattered?" — not on 20-min page *(uncertain)*
- 30 min, Discussion: "What happened to profit in Round 1 when everyone kept lowering prices?" — 30-min steps forbid price changes and have one round; matches 45-min content *(uncertain)*
- 30 min, Discussion: "What differentiations did teams add in Round 2?" — not on 30-min page *(uncertain)*

**C7 Page/item references (check by hand)**
- 45 min, step 1, Done when: "Every team has identical counted stock and an empty cup on the desk."
- 45 min, step 2, Done when: "Every team's round-one sales and final price are on the board."
- 45 min, step 3, Say this: "Make a loyalty card."
- 45 min, step 5, Done when: "Every team has three profit figures charted, one per round."

### Ch6 — True Cost Detective: Finding Hidden Expenses (story: Hidden Costs)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 45 min [budget: standard]: Standard budget item 'Pencil-and-paper math for the profit work. No calculators needed'; 45-min MATERIALS lists 'Calculators'.
- 45 min, Before class [budget: standard]: Standard description 'the prices go on the board' (item: 'Prices for each cost item written on the board'); 45-min Before class 'Print the price sheet' and step 3 'using provided price sheet'. Price sheet not in 45-min MATERIALS. Missing: printed price sheet.

**C3 Grade mismatch**
- 20 min, step 3: 20-min (K-1): 'Add up all costs. Subtract from $10 revenue. Calculate true profit. Chart: Revenue ($10) - Costs ($___) = Profit ($___).' - multi-step money math (revenue - costs = profit).
- 20 min, step 2: 20-min (K-1): 'Estimate cost for each item.' *(uncertain)*
- 30 min, step 3: 30-min (grades 1-3): same 'Add up all costs. Subtract from $10 revenue. Calculate true profit.'

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C5 Cross-version / off-page references**
- 30 min, Discussion: "Which category had the most hidden costs?" — 30-min steps have no cost categories (categories appear in 45-min) *(uncertain)*

**C7 Page/item references (check by hand)**
- 45 min, step 1, Done when: "All four terms are on the board with a one-line meaning each."
- 45 min, step 2, Done when: "Every sheet has at least two items listed in all three categories."
- 45 min, step 3, Say this: "Real numbers off the price sheet now, not guesses."
- 45 min, step 4, Done when: "Every sheet shows both prices and the saving calculated."
- 45 min, step 5, Done when: "Every tracking sheet has been designed and test-filled with at least three rows."
- 45 min, step 6, Done when: "Every sheet shows the full subtraction with labor included and the original guess beside it."

### Ch7 — Order Overload: Priority & Delegation Simulation (story: Too Much Work)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5, 6, 7 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 20 min, step 2 [budget: both]: Step 2 task cards are 'organize bookshelf, sharpen pencils, sort papers, etc.'; MATERIALS/budgets task cards are 'draw a star, write your name 3 times, count to 20, fold a paper airplane, stack 10 blocks'. Pencil sharpener and papers to sort not listed. Missing: pencil sharpener, papers to sort. *(uncertain)*
- 30 min, step 1: Step 1 'Each student gets 8-10 task cards (draw, fold, sort, count, write, build)'; MATERIALS '10 task cards per team'. Build/fold/sort need blocks and paper, not in 30-min MATERIALS (blocks and paper are in both budgets). Missing: blocks/building materials, paper for folding/drawing.
- 30 min, step 6: Step 6 'Reflection & Journaling' - write; no paper/journals in 30-min MATERIALS (paper in budgets). Missing: paper/journals. *(uncertain)*
- 45 min, Before class: Before class 'sets of eight to ten, one set per student'; MATERIALS '15 task cards per team'. *(uncertain)*
- 45 min, step 1: Tasks 'draw, fold, sort, count, write, build' need blocks, paper, pencils; none in 45-min MATERIALS (all in both budgets). Step 6 'journal' not listed. Missing: blocks, paper, pencils, journals.
- 45 min, step 3 [budget: both]: Watch for 'Ask who's the fastest cutter' implies cutting; no scissors in MATERIALS or either budget. Missing: scissors. *(uncertain)*
- 45 min [budget: both]: MATERIALS 'Timers for each team'; budgets supply one 'Classroom clock or the teacher's phone as the visible timer'. *(uncertain)*

**C3 Grade mismatch**
- 20 min, step 2: 20-min (K-1): 'Read all tasks. Decide: Which is most urgent? Which takes longest? Which should go first? Make priority list.' and step 1 'Review concepts: priority, delegation, time management.'
- 30 min, step 4: 30-min (grades 1-3): 'Assign dollar values to each task. Calculate: revenue from completed tasks minus cost of team wages.' - multi-step money math / labor cost.
- 30 min, step 5: 30-min (grades 1-3): 'Groups create a simple hiring plan showing when to add each team member and what they'd do.'
- 30 min, step 2: 30-min (grades 1-3): 'Introduce urgent vs. important matrix.' *(uncertain)*

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C7 Page/item references (check by hand)**
- 45 min, step 1, Done when: "Every student has a count of completed tasks written on their sheet."
- 45 min, step 2, Done when: "Every student's incomplete tasks are sorted into the boxes with at least one marked skippable."
- 45 min, step 3, Say this: "Don't all start on the same card."
- 45 min, step 3, Done when: "Every team has a written role assignment and a completed-task count."
- 45 min, step 6, Done when: "Every journal has an answer to all three questions."
- 45 min, step 7, Say this: "Cards back in their sets, counted."
- 45 min, step 7, Done when: "Every card set is returned complete and every student has spoken to a partner."

### Ch8 — Pivot Challenge: Adapt Your Business (story: The Pivot)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5, 6 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 45 min, Before class [budget: both]: Budget descriptions/items say scenarios are 'read aloud by the teacher from the instructor guide' (standard description: 'The scenarios are read aloud'); 45-min Before class 'Have the four weeks of sales data printed for every team' and step 2 'Teams receive detailed failing business scenarios with 4 weeks of sales data'.
- 30 min, step 1 [budget: both]: Budgets say scenarios read aloud by teacher; 30-min step 1 'Each group gets a different failing business scenario' with MATERIALS '3 scenario cards'. *(uncertain)*
- 45 min, step 4 [budget: both]: Watch for 'Give each group one required question off the card'; question card not in MATERIALS or either budget. Missing: investor question card.
- 20 min, step 2: Step 2 'Set up, create product, prepare to sell. Begin initial sales' - selling with no tokens/coins or product-making supplies in 20-min MATERIALS (paper clips in both budgets). Missing: tokens/coins for sales. *(uncertain)*

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C7 Page/item references (check by hand)**
- 45 min, step 1, Done when: "At least three real pivots are on the board with the before and after named."
- 45 min, step 2, Done when: "Every team has a bar chart of all four weeks and revenue, cost and profit calculated."
- 45 min, step 3, Say this: "Four boxes. What you're stopping. What you're focusing on. The evidence from your chart."
- 45 min, step 3, Done when: "Every Pivot Plan names one thing being stopped and cites a number from the chart."
- 45 min, step 5, Done when: "Every team has a post-pivot profit figure written beside its prediction."

### Ch9 — Partnership Agreement: Who Does What? (story: The Partnership)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 45 min, Before class [budget: both]: Standard description 'The agreement itself is folded paper' and lowCost 'Nothing else is needed'; both budgets put skills inventory questions 'written on the board'. 45-min Before class 'Print the skills inventory and the agreement template'.
- 45 min, step 2: Step 2 'Students complete skills inventory and business interest survey'; neither in 45-min MATERIALS. Not in budgets as printed items (questions on board only). Missing: skills inventory, business interest survey.
- 20 min, step 3 [budget: both]: Step 3 'Both partners sign agreement'; budget description 'Pens for the signing' but 20-min MATERIALS lists only pencils. Missing: pens. *(uncertain)*
- 30 min, step 4 [budget: both]: Step 4 'Both sign and date'; 30-min MATERIALS lists pencils only, budgets buy pens for signing. Missing: pens. *(uncertain)*

**C3 Grade mismatch**
- 20 min, step 3: 20-min (K-1): 'Partners create simple written agreement: business name, what each person will do (responsibilities), how to make decisions (vote? take turns? discuss?), how to split work fairly. Both partners sign agreement.' - written contract for K-1.
- 30 min, step 4: 30-min (grades 1-3): 'Partners create comprehensive written partnership agreement: business description, each partner's specific responsibilities, decision-making process, work schedule, how to handle disagreements, exit plan' - contract / long writing.
- 30 min, step 3: 30-min (grades 1-3): 'Partners discuss and negotiate responsibilities ... Practice compromise' *(uncertain)*

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C7 Page/item references (check by hand)**
- 45 min, step 1, Done when: "At least three things a partnership agreement must cover are listed on the board."
- 45 min, step 2, Done when: "Every student has a partner and both have completed skills inventories on the table."
- 45 min, step 3, Done when: "Every pair has a drawn model with all five parts labeled."
- 45 min, step 4, Done when: "Every agreement has all the required sections filled, including the exit clause."
- 45 min, step 5, Done when: "Every agreement carries written feedback from another pair."
- 45 min, step 6, Done when: "Every agreement is signed by both partners with at least one visible revision."

### Ch10 — Holiday Rush: Inventory & Demand Forecasting (story: The Seasonal Rush)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 20 min, step 1 [budget: both]: Step 1 'Each student gets 10 tickets to spend'; tickets not in 20-min MATERIALS or either budget (budgets use a written budget card). Missing: tickets.
- 20 min, step 3 [budget: both]: Step 3 'Roll die or draw card to show demand'; no die or demand cards in 20-min MATERIALS. Demand cards (in envelopes) are in both budgets; a die is in neither. Missing: die, demand cards.
- 20 min, step 1: Step 1 products 'pencils, erasers, bookmarks'; MATERIALS gives '20 craft items (pom-poms, beads, or paper squares)'. *(uncertain)*
- 20 min [budget: standard]: Standard description 'The stock is paper squares' (free); 20-min MATERIALS also offers pom-poms or beads, which would be bought. *(uncertain)*
- 30 min, step 1 [budget: both]: Step 1 'Show product cards' and step 2 'last year's sales data (simplified cards)'; neither in 30-min MATERIALS. Budgets put last year's figures on the board; no product cards in budgets. Missing: product cards, last year's sales data cards.
- 30 min, step 3: Step 3 'draw customer cards'; MATERIALS has 'Order form cards (15-20 cards with customer orders)' - possibly the same. Missing: customer demand cards. *(uncertain)*

**C3 Grade mismatch**
- 20 min, step 1: 20-min (K-1): 'Students must predict demand and 'buy' inventory' - forecasting. *(uncertain)*
- 30 min, step 4: 30-min (grades 1-3): 'Calculate profit: revenue from sales minus cost of all inventory ordered (including unsold items).' - multi-step money math with a $200 budget.
- 30 min, step 2: 30-min (grades 1-3): 'review last year's sales data ... make ordering decisions for 5-6 products. Write predictions' - forecasting.

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C5 Cross-version / off-page references**
- 30 min, Discussion: "Which week was hardest to predict? Why?" — 30-min has a single holiday season, no weeks *(uncertain)*
- 45 min, Discussion: "What strategy worked best: ordering all supplies upfront, or weekly?" — 45-min uses three seasons, no weekly ordering *(uncertain)*
- 45 min, Discussion: "When did batch production help the most?" — no batch production step on 45-min page *(uncertain)*
- 45 min, Discussion: "Why does saving 30% during busy season make business sense?" — no savings step on page (story reference) *(uncertain)*
- 45 min, Extensions: "Graph revenue across all 4 weeks to visualize the seasonal curve" — 45-min uses three seasons, not 4 weeks *(uncertain)*

**C7 Page/item references (check by hand)**
- 45 min, step 1, Done when: "The three seasons and last year's chart are up where everyone can read them."
- 45 min, step 2, Done when: "Every team has a written, committed order for all products."
- 45 min, step 3, Done when: "Every team has a profit or loss figure and a written change for next round."
- 45 min, step 4, Done when: "Every team has a holiday order with a written yes or no on the bulk deal."
- 45 min, step 6, Done when: "Every team's chart shows revenue, cost and profit for all three seasons."
- 45 min, step 7, Done when: "Every student has written one forecasting tip."

### Ch11 — Slow Season Strategy: What Do Smart Businesses Do? (story: The Slow Season)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 45 min, Before class [budget: both]: Both budgets: 'Business scenarios read aloud by the teacher from the instructor guide' (standard description 'Scenarios are read aloud'); 45-min Before class 'Cut the six scenario cards' and step 2 'Each team receives a "Business Scenario" card'. Missing: scenario cards (not in budgets).
- 45 min, step 1 [budget: both]: MATERIALS 'Research materials (printed examples of real businesses' slow season strategies)'; not in either budget ('Nothing bought'). *(uncertain)*
- 30 min, step 2 [budget: both]: Step 2 'Students run classroom business through simulated seasons ... Track sales data ... What happens to money? To inventory?' - needs money/tokens, inventory and sales tracking; none in 30-min MATERIALS. Standard budget says 'Budget figures written straight onto the plan sheet instead of counted out in tokens'. Missing: tokens/play money, inventory items, sales tracking sheet. *(uncertain)*
- 30 min, step 3 [budget: both]: Step 3 'students research different slow season strategies'; no research materials in 30-min MATERIALS or budgets. Missing: research materials. *(uncertain)*

**C3 Grade mismatch**
- 20 min, step 3: 20-min (K-1): 'For each, explain: How would this help? What would it cost? When would you do it? Rank strategies: best to worst.' and step 4 'Which are short-term vs. long-term?' *(uncertain)*
- 30 min, step 4: 30-min (grades 1-3): 'Students individually choose which strategies they'd use and create simple slow season survival plan.' - written plan.
- 30 min, step 3: 30-min (grades 1-3): 'In groups, students research different slow season strategies ... Each group becomes expert on one strategy.' *(uncertain)*

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C7 Page/item references (check by hand)**
- 45 min, step 1, Done when: "At least four real seasonal businesses and what they do off-season are on the board."
- 45 min, step 2, Say this: "One card per team. It tells you what you sell, how long your quiet spell is, and exactly how much money you have."
- 45 min, step 2, Done when: "Every team can point to its reserve figure and the length of its slow season."
- 45 min, step 3, Done when: "Every team's plan has all three parts filled and at least three named strategies."
- 45 min, step 4, Done when: "Every team has presented all four parts and taken a question."
- 45 min, step 5, Done when: "All five strategies from the story are matched to a team's plan on the board."
- 45 min, step 6, Done when: "The class anchor chart is built and every student has written a personal answer."

### Ch12 — Business Expo & Season Reflection (story: The Big Picture)

**C1 Missing coaching**
- 20 min: no Before class / no Running long or short; steps 1, 2, 3, 4, 5 have no Say this / Watch for / Done when
- 30 min: no Before class / no Running long or short; steps 1, 2, 3, 4 have no Say this / Watch for / Done when

**C2 Budget vs steps**
- 45 min [budget: standard]: Standard description 'One pad of chart paper for the posters. Everything else is already bought' and item 'No calculators needed'; 45-min MATERIALS lists 'Large poster board or tri-fold display boards', 'Calculators', 'Award ribbons or certificates', 'decorating supplies' - none in either budget. Missing: tri-fold/poster boards, calculators, award ribbons/certificates, decorating supplies.
- 45 min, Before class [budget: both]: Before class 'Pull together whatever sales data exists from earlier chapters' and 'Bring spare figures'; not in 45-min MATERIALS or budgets. Missing: prior sales data/records, spare figures.
- 30 min, step 2: Step 2 'Display posters around room'; no tape in 30-min MATERIALS (masking tape in both budgets). Missing: tape.
- 20 min, step 2: Step 2 'display products or business materials, make signs with business names'; no sign paper or products in 20-min MATERIALS (MATERIALS: chart paper or whiteboard, markers, index card). Missing: paper for signs, products/business materials from the season. *(uncertain)*

**C3 Grade mismatch**
- 20 min, step 2: 20-min (K-1): 'make signs with business names, create simple presentations about what they learned' *(uncertain)*

**C4 Empty accommodations:** English Language Learners, Students with Learning Differences, Advanced Students

**C5 Cross-version / off-page references**
- 20 min, step 1: "students will showcase classroom businesses, products made, or business ideas from the season" — cross-chapter
- 30 min, step 1: "Business name and what they "sold" (from previous activities)" — cross-chapter
- 45 min, Before class: "Pull together whatever sales data exists from earlier chapters" — cross-chapter
- 45 min, step 1: "If students ran simulated businesses during previous activities, compile their data Calculate total "revenue" (sales from previous activities)" — cross-chapter
- 45 min, step 1: "Missing records from earlier chapters." — cross-chapter (Watch for)
- 45 min, step 2: "Products offered (photos or samples from previous activities)" — cross-chapter
- 45 min, Materials: "Optional: photos from previous activities" — cross-chapter

**C7 Page/item references (check by hand)**
- 45 min, step 1, Done when: "Every student or team has revenue, expenses and profit calculated with a bar graph."
- 45 min, step 2, Say this: "Six things on your display."
- 45 min, step 2, Done when: "Every booth displays all six sections."
- 45 min, step 5, Say this: "Six awards, and growth counts as much as profit."
- 45 min, step 5, Done when: "All six awards are handed out and every student has given a final answer."


## Could not check

- **The running page.** I did not start the dev server or open the page. All findings come from the data file and the code.
- **The story videos.** C6 (names) and C7 (page/item references) need the episode scripts or books. I do not have them, so C7 is a list only, and C6 flags marked uncertain may be correct story details.
- **The live database.** `scripts/export-activities.sh` pulls from Supabase. I did not run it, so the audit uses the local JSON, not the database.
- **The committed data.** The JSON on disk has uncommitted changes. The last commit (`67d6fcc`) may differ. I did not audit the two untracked backup files.
- **The retired premium budget.** It is hidden in the UI, so I did not audit it.
- **Spanish content.** I checked only whether `.es` copies `.en`. I did not check Spanish text quality.
- **Judgment checks (C2, C3, C6).** Four reading passes did these, one per season. Their strictness may differ a little between seasons: S3 has more C2 items marked uncertain. "Too hard for the grade" is a judgment call.
- **"Universal" room items.** C2 skips the board, desks, chairs and the story video. Everything else not in a version's materials list is counted.
