# Content Audit — After Fix Pass

Date: 2026-09-16. Branch `fix/content-pass-2026-09-16`. Data: `src/activitiesData.json` at the last commit on the branch.

## Before / after

| Check | Before S1 | S2 | S3 | S4 | **Before total** | After S1 | S2 | S3 | S4 | **After total** |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| C1 Missing coaching | 150 | 162 | 159 | 161 | **632** | 0 | 0 | 0 | 0 | **0** |
| C2 Budget vs steps | 41 | 51 | 88 | 56 | **236** | 13 | 20 | 8 | 5 | **46** |
| C3 Grade mismatch | 19 | 22 | 35 | 24 | **100** | 10 | 22 | 14 | 15 | **61** |
| C4 Empty accommodations | 36 | 36 | 36 | 36 | **144** | 0 | 0 | 0 | 0 | **0** |
| C5 Cross-version refs | 12 | 19 | 21 | 22 | **74** | 10 | 7 | 11 | 16 | **44** |
| C6 Name drift (chapters) | 2 | 2 | 0 | 1 | **5** | 0 | 2 | 0 | 1 | **3** |
| D1 Materials twice (chapters) | 12 | 12 | 12 | 12 | **48** | 0 | 0 | 0 | 0 | **0** |
| D2 Inline dash lists | 7 | 27 | 9 | 0 | **43** | 0 | 0 | 0 | 0 | **0** |
| D3 Time in step title | 12 | 63 | 0 | 0 | **75** | 0 | 0 | 0 | 0 | **0** |
| **All checks** | | | | | **1357** | | | | | **154** |

How to read this:
- **C1, C4, D1, D2, D3** were counted by script. They use the same rules as before.
- **C2** now checks against the budget lists, because the page now shows only those. Before, it checked each version's old materials list.
- **C2, C3, C5** after counts include items the reader marked uncertain. Uncertain: C2 38, C3 45, C5 27.
- **C3** before counted hard tasks with no K-1 path. After counts steps that still have no "Tier 1 (K-1):" line. The grade ranges in the duration text are gone from all 144 versions.
- **C5** after leaves out references to earlier chapters or the story. Those are fine and were kept on purpose (104 of them). Before, they were counted.
- **C6** after counts chapters with a name question still open for the owner: S2 Ch9 (La Vecina), S2 Ch12 (Diego), S4 Ch2 (who asks for a plan). S1 Ch2 and S4 Ch2 "Benny in CH1" were checked against the scripts and are correct. S1 Ch11 was fixed.
- **D2** is 0 because the page now turns every inline " - " and " * " list into bullets (72 steps). Math minus signs use "−", so they are never split.
- **Two different readers** did the before and after passes, so C2, C3 and C5 are not exact like-for-like counts.

## Remaining findings

### Season 1

**Ch1 — Neighborhood Treasure Hunt**
- **C2** 30 min, step before_class: 'Cut plain paper in half' needs scissors; neither budget lists scissors or says the room has them (paper could be folded/torn). *(uncertain)*

**Ch2 — Plant & Save: The Patience Jar**
- **C2** 45 min, step 1: Standard description says 'The savings journal is folded and stapled from plain paper', but no step in any version folds or staples it; 45 steps use a 'mini-book' that is never made. *(uncertain)*
- **C2** 30 min, step 2: 'Label with name marker' — no marker in either budget (pencil may suffice). *(uncertain)*
- **C3** 45 min, step 6: No Tier 1 line: '$1/week for 10 years? (Answer: $520.)' — multi-step money math over $10; the SAY THIS does give the answer. *(uncertain)*
- **C3** tier4_focus: Tier 4 focus uses 'compounding' / 'Model how consistent saving builds up' for flat $1/week saving, which is linear, not compounding. *(uncertain)*
- **C5** 45 min, step 1: This time, students also set up a "seed observation log" page in their mini-book
- **C5** 45 min, step 2: DONE WHEN: All four pages have writing on them and page three shows a number of weeks. *(uncertain)*

**Ch3 — Set Up the Trading Post**
- **C2** 45 min, step 1: Both descriptions say 'Students bring one item from home', but steps treat each student as having several items: 30 step 1 'For each item', 30 step 2 'arranges their items', 45 step 1 'For each item... Whole booths of five-token items', 45 step 6 're-price anything you've still got'.
- **C5** 45 min, step 8: Fill in trade log. Total tokens in and out — did you "profit"? *(uncertain)*

**Ch4 — Map It! Classroom Expedition & Blueprint Challenge**
- **C3** 45 min, step 4: No Tier 1 line: 'agree on one route that hits the four best discoveries in the fewest steps' — route optimization across four maps. *(uncertain)*
- **C5** 45 min, step 3: Give your partner your map and planning sheet but NOT your discovery log. *(uncertain)*

**Ch5 — The Skills Fair**
- **C2** 20 min, step before_class: lowCost lists only index cards and its description covers only plain paper; pencils and crayons are used (20 Before class 'set out crayons'; 30 Before class 'Set out index cards, pencils and crayons').

**Ch6 — Classroom Savings Jar Simulation**
- **C2** 45 min, step 2: Descriptions say 'All coins are paper', but 45 step 2 says 'hidden 30 "coins" (paper or play)'. *(uncertain)*
- **C3** 30 min, step 1: No Tier 1 line: 'Students draw a quarter in Row 1 and write $0.25' — decimal money notation.
- **C3** 30 min, step 2: No Tier 1 line: students record Day 1–7 amounts incl. 'Day 7: $3.45' — decimals.
- **C3** 45 min, step 1: No Tier 1 line: ledger 'Date | Amount Found | Running Total | How Found' — running money totals.
- **C3** 45 min, step 3: No Tier 1 line: pairs 'sort by denomination and count... Class verifies the grand total' — mixed-coin money totals. *(uncertain)*
- **C3** 45 min, step 4: No Tier 1 line: proposal 'split the money equally. (Propose how.)' — division of money. *(uncertain)*
- **C5** 45 min, step 6: Record the winning decision in the class savings ledger. *(uncertain)*

**Ch7 — Blueprint & Build Challenge**
- **C2** 45 min, step 4: Step suggests found items not in the budget: '(Rubber bands? Paper clips? ...)', but both budgets list rubber bands and paper clips as tray materials (30 Before class puts them in the tray). *(uncertain)*
- **C2** 45 min, step 6: 'scrap-paper inspection slip' — standard lists plain paper but not scrap paper. *(uncertain)*

**Ch8 — Recipe Math: Cost Per Serving Challenge**
- **C3** 45 min, step 7: No Tier 1 line: 'I save $[Z] per serving. In a year, that's $[A].' — required in DONE WHEN, though Tier 1 skipped the yearly figure in step 5.

**Ch9 — Fix-It Workshop**
- **C3** 45 min, step 1: No Tier 1 line: 'students must write a diagnosis for all 4 items: What is broken? How did it break? What's the best tool to fix it?' — twelve written answers. *(uncertain)*
- **C5** 45 min, step 4: Calculate total cost to fix vs. total replacement cost vs. total savings.

**Ch10 — Community Resource Map**
- **C2** 20 min, step 2: Both descriptions say 'One large shared map'; the 20-min version makes no map (a board list only). *(uncertain)*
- **C2** 30 min, step 1: Standard says 'Every student adds a resource profile to it'; the 30-min version has no resource profiles (cards are sorted onto Free/Borrow/Must Buy sheets), and 20-min has none either. *(uncertain)*

**Ch11 — Giving Circle: The Abundance Simulation**
- **C2** all, step items: Descriptions say 'every square counts as one token' (steps agree), but the construction paper item says 'three colors for three token values'. *(uncertain)*
- **C2** 45 min, step 6: 'draw the line on scrap paper' — standard lists plain paper but not scrap paper. *(uncertain)*
- **C5** 30 min, step title: 3-Round Giving Circle *(uncertain)*
- **C5** 45 min, step 3: Write down every give in your journal. *(uncertain)*

**Ch12 — My Season 1 Treasure Book & Exhibition Walk**
- **C2** all, step items: 'Index cards — 50, cut in half for response cards' needs scissors; neither budget lists scissors or says the room has them. *(uncertain)*
- **C5** 45 min, step 1: Mini-Book Creation — Extended Version *(uncertain)*
- **C5** 45 min, step 6: Total the rows. *(uncertain)*

### Season 2

**Ch2 — Lemonade Stand Showdown**
- **C2** 20 min, step before_class: Before class says 'Cut the colored paper into cup cards' (also 30-min); scissors are not in the From Scratch items (Season 1 kit reuse lists only pencils and crayons). *(uncertain)*
- **C3** 45 min, step 4: No Tier 1 line; Watch For asks K-1 to work out 'how many extra cups they now need to beat round one' (multi-step price/quantity math). *(uncertain)*
- **C5** 20 min, step title: Menu Design Challenge
- **C5** 45 min, step discussion: What was wrong with the price war strategy? *(uncertain)*

**Ch3 — Assembly Line vs. Solo Challenge**
- **C2** 45 min, step 3: Budget item says 'Scissors, 1 pair for every two students', but 45-min Solo Setup says 'Your own paper, your own scissors, your own desk' and Done When 'full set of supplies at their own desk'.
- **C2** None: Budget item 'Recycled paper bin for the practice run' - no version has a practice run. *(uncertain)*
- **C2** 30 min, step 4: Tally marks (30 step 4) and 'written the number down' (45 step 4) need a writing tool; pencils not listed (crayons/markers may serve). *(uncertain)*
- **C3** 45 min, step 5: No 'Tier 1 (K-1):' line; Say This: 'Divide the solo total by how many people' (only an inline '(K-1: skip this...)' aside), and Done When still requires 'a per-person number' on the board. *(uncertain)*
- **C3** 20 min, step 5: No Tier 1 line; 'let's add up all the solo ones' across the whole class and 'Graph the data together'. Teacher-led, likely OK. *(uncertain)*
- **C5** 45 min, step discussion: What was your prediction vs. actual result?

**Ch4 — My Family's Travel Trunk**
- **C2** 20 min, step before_class: Before class (20 and 30) sets out markers; Basic Classroom assumes crayons but not markers and does not list them. *(uncertain)*
- **C2** 30 min, step 3: Writing initials (30 step 3), item cards (30 step 2), 'write the because' (45 step 2): no pencils listed; markers/crayons may serve. *(uncertain)*

**Ch5 — Spice Detectives: Smell, Sort & Trade**
- **C2** 20 min, step before_class: All versions put 'a paper towel over each' cup; From Scratch lists rubber bands to hold a paper towel square but never lists paper towels (Basic Classroom does).
- **C2** 20 min, step before_class: 'Cut scrap paper into small cards' (20) and 'cut spice cards' (30); scissors not listed for From Scratch. *(uncertain)*
- **C2** 45 min, step 1: Step 1 'Show map of spice routes' / Done When 'The route map is up'; budgets list only a general world map. *(uncertain)*
- **C2** 20 min, step before_class: Budget says paper cups are for 'the ten smelling stations'; 20-min uses five cups and 30-min six to eight. *(uncertain)*

**Ch6 — Going, Going, Gone! Classroom Auction**
- **C2** 20 min, step before_class: 'Cut a scrap-paper budget card for every student'; scissors not listed for From Scratch. *(uncertain)*
- **C3** 45 min, step 2: No Tier 1 line; after each sale students 'update budgets' (subtract bids from $100); Watch For: 'make the whole room update the card'. Multi-step money math over $10.
- **C3** 45 min, step 3: No Tier 1 line; 'Hands up if you've got less than thirty dollars left' requires tracking a running balance from $100. *(uncertain)*

**Ch7 — Baker's Math: Recipe Costs & Bakery Economics**
- **C2** 30 min, step 1: Budget item: price list 'four parts, four prices'; 30-min recipe lists three parts (cardstock $2.00, tissue $1.50, tape 50¢) and 45-min adds packaging prices (bags, labels, ribbon).
- **C2** 45 min, step before_class: Budget: price list 'written on the board by the teacher; nothing printed'; 45-min Before class 'Cut the parts sheets' and step 1 'Receive the parts cost sheet' per team. *(uncertain)*
- **C3** 30 min, step 4: No Tier 1 line; compare cost per item to price: 'A paper cake topper at the party shop costs $1.50. Ours costs 40¢'; Watch For 'Ask how much money they lose on each one they sell' (decimal money math).
- **C3** 30 min, step 1: No Tier 1 line; 'Every group can name the three parts and what each one costs' with decimal prices ($2.00 for 4 sheets, $1.50, 50¢ for 2 feet). *(uncertain)*
- **C3** 20 min, step 4: No Tier 1 line; 'Our pastry costs $1.75 to make... How about $2.00? $2.50? $3.00?' (decimal price comparison, teacher-led). *(uncertain)*
- **C5** 45 min, step 2: Follow the build recipe, measuring and cutting each part *(uncertain)*

**Ch8 — The Morning Market: Fresh or Not?**
- **C2** 30 min, step before_class: 'Give the market buyer a cup of paper-clip coins'; no cup/container listed. *(uncertain)*
- **C2** 45 min, step 5: Tier 1 line 'color one bar for each'; From Scratch lists pencils but no crayons. *(uncertain)*
- **C3** 30 min, step 5: No Tier 1 line; 'Students count final money. Graph results on board' - totals up to $20 from $10/$5/$1 sales across three rounds; Tier 1 focus says two periods only, but all 30-min rounds lack a Tier 1 line. *(uncertain)*
- **C3** 45 min, step 1: No Tier 1 line; 'Receive starting cash $50', '$50 counted out on the desk' and 'Write down everything you're holding'.
- **C3** 45 min, step 2: No Tier 1 line; sellers 'negotiate' and mark sales on a tracking sheet with 'Revenue: $______' per period ($8/$5 prices). *(uncertain)*

**Ch9 — Our Community Garden Blueprint**
- **C2** 30 min, step 3: 'Select seeds/plants from catalog' (30 step 3, 45 step 3); no catalog in either budget (only vegetable picture cards). *(uncertain)*
- **C5** 45 min, step 4: Their expected harvest value (at market price): $______ *(uncertain)*

**Ch10 — Handmade Holiday Workshop**
- **C2** 45 min, step before_class: Budgets: 'Classroom clock or the teacher's phone as the timer; students write start and end times'. 45-min: 'One timer per station', step 1 'start timer when you begin, stop when done' and Done When 'a running timer' per student.
- **C3** 30 min, step 2: No Tier 1 line; students write 'Start time / End time / Total minutes' (reading clock and elapsed-time subtraction).
- **C3** 30 min, step 4: No Tier 1 line; 'The store bracelet costs $1. Ours cost $2.10 to make' (decimal money comparison, discussion-led). *(uncertain)*
- **C3** 45 min, step 2: No Tier 1 line; students track materials used with 'a number beside every line', time spent and 'Quality level (self-assessment)'. *(uncertain)*
- **C3** 45 min, step 5: No Tier 1 line; 'Handmade beaded bracelet: $3.50 (took 12 minutes)' vs '$1.00' (decimal comparison, discussion-led). *(uncertain)*
- **C3** 45 min, step 6: No Tier 1 line; tracking sheet in step includes 'Profit per item', 'Difference: $_____' and 'If I made 10 of these, it would take _____ hours!' (minutes-to-hours conversion). *(uncertain)*
- **C5** 45 min, step 2: Craft Production — Round 1 *(uncertain)*
- **C5** 20 min, step discussion: How long did you work on this? *(uncertain)*

**Ch11 — Value Beyond Price: Memory Art Project**
- **C2** 45 min, step 2: 'Drawing/painting base'; no paint in either budget (drawing is offered as the alternative). *(uncertain)*
- **C3** 20 min, step 3: Step text is written only for K and 1st: 'K: Dictate to teacher' / '1st: Copy and complete'; Say This 'First graders, copy it'. Conflicts when Tier 2-4 is selected (step text, not bestFor/breakdown). *(uncertain)*

**Ch12 — Our Community Market Day**
- **C2** 30 min, step before_class: Budget item 'Student desks pushed into six booth clusters'; 30-min Before class 'Push desks into four booths'.
- **C2** 45 min, step 1: 45-min Repair & Service Station 'sharpen pencils, for fee'; its no-cost alternative covers broken items only, and no pencil sharpener is listed (30-min alternative covers it). *(uncertain)*
- **C3** 30 min, step 5: No Tier 1 line; 'Vendors count revenue' with $20 budgets ('Count your money'), totals can exceed $10.
- **C3** 30 min, step 4: No Tier 1 line; round two selling, 'Vendors, sell, make change and write down every sale' (Tier 1 line appears only in round 1). *(uncertain)*
- **C3** 30 min, step 1: No Tier 1 line; price tags using labor cost: 'Think about what it cost to make and how long it took'. *(uncertain)*
- **C3** 45 min, step 2: No Tier 1 line; vendors 'Negotiate prices, Track inventory, Provide receipts', Market Managers 'make change'.
- **C3** 45 min, step 6: No Tier 1 line; 'Vendors count revenue, complete tracking sheets'.

### Season 3

**Ch1 — What Can YOU Make? Skills Inventory & Dream Product**
- **C3** 45 min, step 2: No Tier 1 line: 'Brainstorm 5 possible products you could make using your skills' (write five ideas, cross out four) — a lot of writing for K-1 *(uncertain)*

**Ch2 — Wood & Materials Explorer Lab**
- **C5** 20 min, step title: Material Pass-Around & Sort *(uncertain)*

**Ch3 — Measure Twice, Cut Once: Precision Building Challenge**
- **C2** 30/45, step 30 step 2, 30 step 4, 45 step 3, 45 step 4: Tier 1 (K-1) lines say 'trace a ready-made template' / 'lay the template on top'; no template is listed in either budget (30 step 1 'Show template with measurements' is covered by the board drawing, the traceable template is not) *(uncertain)*
- **C2** 45 min, step 1: Step says 'Each team writes $10 at the top of a scrap-paper budget card'; both budgets list index cards 'for the $10 budget cards' (not missing, just inconsistent) *(uncertain)*
- **C3** 45 min, step 2: No Tier 1 line: 'Calculate how many pieces needed and measurements; Draw cutting diagram to minimize waste' for a 5"x5"x3" box — multi-step measured planning too hard for K-1
- **C5** 20 min, step 3: Discuss what happened when steps were rushed or measurements were off
- **C5** 45 min, step 4: Everything gets measured, including the one I made *(uncertain)*

**Ch4 — Package Design & Branding Workshop**
- **C2** 20 min, step Before class: 20-min Before Class puts 'scrap paper, crayons, glue and a box' at each table; From Scratch list has markers but no crayons (Basic Classroom has crayons from classroom supply)
- **C5** 20 min, step title: Plain vs. Decorated Bag Test

**Ch5 — Clay Creations Workshop**
- **C2** 30 min, step Before class / step 1: 30-min Before Class: 'Have a clay pot, mug or photo ready to compare'; step 1 compares with 'a clay pot or mug from home, or a photo of one'. Neither budget lists the pot, mug or photo *(uncertain)*
- **C2** 20/30, step Before class: 'a cup of water on every table' / 'a cup of water per table'; Basic Classroom lists only 'Water from the classroom sink' (From Scratch says 'a cup per table') *(uncertain)*
- **C2** 45 min, step 1-2: Budget item says clay is 'Enough for 3 small items per student', but 45-min step 1 leaves 'a rough attempt at all three techniques' and step 2 makes 3 more numbered items (6 pieces) *(uncertain)*
- **C5** 20 min, step title: Playdough Mini-Creation *(uncertain)*

**Ch6 — Design Upgrade: Adding Value Through Decoration**
- **C5** 45 min, step Running long: Long: cut the classmate survey to five people. *(uncertain)*

**Ch7 — Transformation Lab: Heat, Mix & Change**
- **C2** 30 min, step Before class: 30-min Before Class sets up 'the paint, a stirring stick'; only From Scratch lists 'A craft stick and a paper cup for stirring the paint demo' *(uncertain)*
- **C3** 20 min, step 3: No Tier 1 line: 'When I ring, stop and write your time' / 'Track time spent at each' (same in 30 and 45) — recording times is hard for K-1 *(uncertain)*
- **C3** 45 min, step 6: No Tier 1 line: DONE WHEN 'Every student has written an answer to both questions' — written reflection for K-1 *(uncertain)*

**Ch8 — Invention Challenge: Solve a Real Problem**
- **C5** 30 min, step title: Design Thinking Process with Prototype
- **C5** accommodations, step learningDifferences: In the 45-minute version, offer a quiet pitch to you alone in place of the whole class. *(uncertain)*

**Ch9 — Blueprint Your Product: From Idea to Plan**
- **C3** 45 min, step 2: No Tier 1 line: 'Sketch rough concept on scrap paper List all parts and features that must be shown' — written parts list *(uncertain)*
- **C3** 45 min, step 7: No Tier 1 line: DONE WHEN 'Every blueprint has written feedback from a partner on it' *(uncertain)*
- **C3** 30 min, step 5: No Tier 1 line: 'Revise blueprints based on feedback' / 'one piece of feedback written on it' *(uncertain)*

**Ch10 — Would You Buy This? Survey & Market Research**
- **C3** tier1_focus, step -: Tier 1 FOCUS 'Simple tally marks (IIII = 5)' — four strokes is 4; five is four strokes with a cross stroke (may be a lost slash in rendering) *(uncertain)*
- **C3** 45 min, step 5: No Tier 1 line: 'adjust product: change price, add/remove features, change target customer Create "before and after" comparison' and write the reason from the data — multi-step data reasoning and writing for K-1
- **C3** 45 min, step 1: No Tier 1 line: 'sketch + name + description + initial price' and 'Write "hypothesis": "I think [number] out of 10 people will want to buy this"' *(uncertain)*

**Ch11 — Production Day: Build Your Product for Real**
- **C2** 45 min, step 3: 'Quality Inspector checks each finished piece against rubric'; no rubric is listed (handwritten items are the price sign, role badges and Production Report) *(uncertain)*
- **C3** 45 min, step 1: No Tier 1 line: 'Estimate: How many can we make? How long will each take? What will materials cost? Write production plan with goals'
- **C3** 45 min, step 3: No Tier 1 line: 'Timer running — track time per item' *(uncertain)*
- **C3** 30 min, step 1: No Tier 1 line: 'Write your steps — first, next, last — and a time goal' *(uncertain)*
- **C5** 20 min, step title: Quick Production Run with Time Tracking
- **C5** accommodations, step ell: In the 45-minute version, give role badges a picture *(uncertain)*

**Ch12 — Our Makers' Faire: Season Showcase & Sale**
- **C3** 45 min, step 3: No Tier 1 line: 'Half class shops with 10-15 tokens worth $10 each ($100-150)' — money math in $10 units up to $150 (Tier 1 lines exist only on steps 1 and 5)
- **C5** 20 min, step 2: create signs with product names and prices *(uncertain)*

### Season 4

**Ch1 — Solo Challenge: Can You Do It All Alone?**
- **C2** all: Paper clips are listed as the task tokens, 'one per completed task' (and standard description says 'Season tokens'), but no step in any version hands out or counts clips; tasks are tracked with check marks, ticks and raised hands. *(uncertain)*
- **C3** 45 min, step 2: No Tier 1 line: 'Read all seven first. Then number them in the order you'll do them... write it down' (reading seven task cards and writing a plan) *(uncertain)*
- **C5** 30 min, step discussion: 30-min version has no specializing round
- **C5** 30 min, step discussion: 30-min version has no team round
- **C5** 45 min, step title: All 45-min steps are solo; no partnership phase and no financial analysis
- **C5** 45 min, step discussion: No partnership round or earnings in this version
- **C5** 45 min, step extension: No earnings or partnership results are produced
- **C5** 45 min, step extension: No team work in this version

**Ch2 — Write Your Mini Business Plan**
- **C3** 45 min, step 3: No Tier 1 line: 'What's the value proposition?... Pick one and write it in a sentence' *(uncertain)*
- **C3** 45 min, step 6: No Tier 1 line: 'Practice pitch: clear, persuasive, data-driven'; done when 'Every plan has written feedback' *(uncertain)*
- **C5** 30 min, step discussion: 30-min version has no role/job assignment
- **C5** 45 min, step 5: No earlier 45-min step produces a timeline, yet done-when requires all five sections *(uncertain)*
- **C5** 45 min, step title: Steps price a single product; no multi-product pricing *(uncertain)*
- **C6** 45 discussion cites 'Benny's mistake in CH1', but the Chapter 1 page credits the solo-work story to Riley and Ellis and never names Benny *(checked in scripts: see fix log)*

**Ch3 — Grand Opening: Run a Classroom Store**
- **C2** 20 min, step before class: Items say paper clips '20 to 30 per customer'; 20-min version gives each customer 10 clips (item note, not description) *(uncertain)*
- **C3** 30 min, step 4: No Tier 1 line; 'Same rules' continues shopkeepers giving change (Tier 1 exact-pay exemption is only on step 2) *(uncertain)*
- **C3** 45 min, step 4: No Tier 1 line; 'Continue operations with new staff' continues change-making and Price − Cost profit per sale (Tier 1 exemption only on step 2) *(uncertain)*

**Ch4 — Customer Service Role-Play Challenge**
- **C2** 30 min, step 3: Standard item says complaint scenarios are read aloud 'no cards needed', but 30 step 3 and 45 before class/steps use scenario cards (another standard item does list the cards) *(uncertain)*

**Ch5 — Competing Businesses: Differentiation Game**
- **C2** 20 min, step 3: Items say paper clips 'about 10 per customer'; 20- and 30-min versions give each customer 8 clips (item note, not description) *(uncertain)*
- **C5** 30 min, step title: 30-min steps run two stores, not four

**Ch6 — True Cost Detective: Finding Hidden Expenses**
- **C2** 45 min, step before class: Standard description says prices go on 'a hand-copied price sheet'; 45 before class says 'Print the price sheet' (standard item allows 'or printed') *(uncertain)*
- **C3** 30 min, step 4: No Tier 1 line; running-short adds 'cut one cost in half and work out the new profit' (halving plus subtraction) *(uncertain)*
- **C3** 45 min, step 2: No Tier 1 line: sort costs into 'Direct costs... Overhead... Labor' *(uncertain)*
- **C3** 45 min, step 5: No Tier 1 line: 'design a simple tracking sheet to log hidden costs. Categories: Supplies, Time, Overhead' and test-fill three rows *(uncertain)*
- **C5** 45 min, step 6: The 45-min version never has students guess the profit (the yes/no guess exists only in the 20- and 30-min versions)

**Ch8 — Pivot Challenge: Adapt Your Business**
- **C3** 45 min, step 4: No Tier 1 line: pitch 'must include: the problem, the data, the pivot decision, predicted results' *(uncertain)*

**Ch9 — Partnership Agreement: Who Does What?**
- **C3** 45 min, step 5: No Tier 1 line: peer review of another pair's contract ('Is conflict resolution specified?'), 'Require one written question per reviewer' *(uncertain)*

**Ch10 — Holiday Rush: Inventory & Demand Forecasting**
- **C3** 45 min, step 5: No Tier 1 line: 'stock sale items... Introduce clearance pricing for leftover holiday inventory' (discount pricing) *(uncertain)*
- **C5** 20 min, step discussion: No version includes saving money *(uncertain)*
- **C5** 30 min, step discussion: 30-min version does no saving *(uncertain)*
- **C5** 45 min, step discussion: 45-min version does no saving *(uncertain)*
- **C5** 45 min, step title/discussion: No batch production or cash-flow step in the 45-min version (only a bulk-order option) *(uncertain)*

**Ch11 — Slow Season Strategy: What Do Smart Businesses Do?**
- **C3** 30 min, step 3: No Tier 1 line: 'students research different slow season strategies... Each group becomes expert' *(uncertain)*
- **C3** 45 min, step 4: No Tier 1 line: 2-minute presentation that must include 'top 3 strategies, and budget plan' *(uncertain)*
- **C5** 30 min, step 2: The simulation only tallies called customers; no money, stock or workers are tracked *(uncertain)*

**Ch12 — Business Expo & Season Reflection**
- **C3** 45 min, step 2: No Tier 1 line: display with 'Financial summary (revenue, expenses, profit chart)', '3-5 key lessons', 'Challenges We Overcame with specific examples', 'Our Future Plan'
- **C3** 45 min, step 3: No Tier 1 line: 1-2 minute 'investor pitch' covering results and future plan *(uncertain)*

