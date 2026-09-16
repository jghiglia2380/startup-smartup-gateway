#!/usr/bin/env node
// check-content.mjs — strict consistency check for src/activitiesData.json.
//
// For every chapter x duration (20/30/45) x budget level (From Scratch / Basic
// Classroom) it reads the text a teacher would see, for Tier 1 and for Tiers
// 2-4, and flags:
//
//   M1  item used in the text but missing from that materials list
//   M2  item in the materials list but never used
//   M3  budget rule broken: From Scratch lists or uses something that is not
//       free; Basic Classroom lists something a school would have to buy
//   M4  budget description or cost line contradicts the steps or the list
//   M5  missing Before class / Running long or short / Say this / Watch for / Done when
//   M6  cross-version reference ("same as the 30-minute version")
//   M7  Tier 1 text with division, audits, percents, averages, money over $20,
//       or a "Tier 1 (K-1): ..." side note in the main text
//   M8  empty tier adaptations, accommodations, or 45-minute extension ideas
//   M9  grade range in a duration description
//   D1  materials rendered more than once
//   D2  a dash in a step description that would render as a bullet by mistake
//   D3  step title repeats its time
//
// Item matching uses the VOCAB table below. Mentions right after "no",
// "without", "instead of" or "skip" do not count as use. Findings that are
// known and accepted go in scripts/check-content.ignore.json with a reason.
//
// Usage: node scripts/check-content.mjs [--data file.json] [--ignore file.json] [--json out.json] [--season N] [--chapter N] [--quiet]
// Exit code 1 when any finding is open.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataArg = process.argv.indexOf('--data');
const DATA_FILE = dataArg >= 0 ? path.resolve(process.argv[dataArg + 1]) : path.join(ROOT, 'src/activitiesData.json');
const DATA = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')).activities;
const ignoreArg = process.argv.indexOf('--ignore');
const IGNORE_FILE = ignoreArg >= 0 ? path.resolve(process.argv[ignoreArg + 1]) : path.join(ROOT, 'scripts/check-content.ignore.json');
const IGNORES = fs.existsSync(IGNORE_FILE) ? JSON.parse(fs.readFileSync(IGNORE_FILE, 'utf8')) : [];

const args = process.argv.slice(2);
const argVal = (flag) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : undefined; };
const ONLY_SEASON = argVal('--season') ? Number(argVal('--season')) : null;
const ONLY_CHAPTER = argVal('--chapter') ? Number(argVal('--chapter')) : null;
const JSON_OUT = argVal('--json');
const QUIET = args.includes('--quiet');

// ---------------------------------------------------------------------------
// Vocabulary. cat: free = fine anywhere; basic = fine in From Scratch too
// (pencils, crayons, tape); classroom = normal school supply, Basic Classroom
// only; buy = has to be bought. A list line that says "free", "from home",
// "recycled" or "scrap" makes a classroom item free. Buy items never become free.
// ---------------------------------------------------------------------------
const W = (s) => new RegExp(`\\b(?:${s})\\b`, 'i');
// Food words do not count when the food is drawn, paper or pretend.
const PRETEND = (s) => new RegExp(`(?<!(?:paper|pretend|play|drawn|toy|fake|picture of|pictures of|cut-out|cutout) )\\b(?:${s})\\b`, 'i');
const VOCAB = [
  // specific paper kinds first; generic "paper" last
  { key: 'chart paper', cat: 'classroom', re: W('chart paper|poster paper|butcher paper|large paper|poster board|posterboard|big sheet|large sheet') },
  { key: 'construction paper', cat: 'classroom', re: W('construction paper|colou?red paper') },
  { key: 'cardstock', cat: 'classroom', re: W('card ?stock') },
  { key: 'grid paper', cat: 'classroom', re: W('grid paper|graph paper') },
  { key: 'index cards', cat: 'classroom', re: W('index cards?') },
  { key: 'sticky notes', cat: 'classroom', re: W('sticky notes?|post-its?') },
  { key: 'newspaper', cat: 'free', re: W('newspapers?') },
  { key: 'magazines', cat: 'free', re: W('magazines?|catalogs?|catalogues?|flyers?|junk mail') },
  { key: 'scrap paper', cat: 'free', re: W('scrap(?:s)?(?: of)? paper|scraps?') },
  { key: 'paper towels', cat: 'classroom', re: W('paper towels?') },
  { key: 'paper plates', cat: 'classroom', re: W('paper plates?') },
  { key: 'paper bags', cat: 'classroom', re: W('(?:paper |lunch |brown )+bags?|bags?') },
  { key: 'paper clips', cat: 'classroom', re: W('paper ?clips?') },
  { key: 'paper', cat: 'free', re: /\b(?:plain |printer |copy |blank |white |drawing |lined )?paper\b(?! (?:cups?|plates?|clips?|towels?|bags?|money|chains?))|\bsheets? of paper\b/i, generic: true },

  { key: 'pencils', cat: 'basic', re: /(?<!colou?red )\bpencils?\b/i },
  { key: 'pens', cat: 'classroom', re: W('pens|ballpoint pens?|gel pens?') },
  { key: 'binder clips', cat: 'classroom', re: W('binder clips?|bulldog clips?|clothespins?') },
  { key: 'colored pencils', cat: 'classroom', re: W('colou?red pencils?') },
  { key: 'crayons', cat: 'basic', re: W('crayons?') },
  { key: 'markers', cat: 'classroom', re: W('markers?|sharpies?|felt[- ]tips?') },
  { key: 'tape', cat: 'basic', re: /\b(?:masking |clear |scotch |painter'?s )?tape\b(?! measure)/i },
  { key: 'glue', cat: 'classroom', re: W('glue(?: sticks?)?|glue-sticks?|paste') },
  { key: 'scissors', cat: 'classroom', re: W('scissors') },
  { key: 'stapler', cat: 'classroom', re: W('staplers?|staples?') },
  { key: 'rulers', cat: 'classroom', re: W('rulers?|yardsticks?|tape measures?|measuring tapes?|meter sticks?') },
  { key: 'hole punch', cat: 'classroom', re: W('hole ?punch(?:es)?') },
  { key: 'string', cat: 'classroom', re: W('string|yarn|twine') },
  { key: 'rubber bands', cat: 'classroom', re: W('rubber ?bands?') },
  { key: 'envelopes', cat: 'classroom', re: W('envelopes?') },
  { key: 'folders', cat: 'classroom', re: W('folders?') },
  { key: 'chalk', cat: 'classroom', re: W('chalk(?! ?board)') },
  { key: 'bell', cat: 'classroom', re: W('bells?|chimes?') },
  { key: 'calculators', cat: 'classroom', re: W('calculators?') },
  { key: 'dice', cat: 'classroom', re: W('dice|die') },
  { key: 'craft sticks', cat: 'classroom', re: W('craft sticks?|popsicle sticks?|lolly sticks?') },
  { key: 'play money', cat: 'classroom', re: W('play money|play coins|plastic coins|real coins|toy money') },
  { key: 'tokens', cat: 'classroom', re: W('tokens?') },
  { key: 'books', cat: 'classroom', re: W('books|picture books?|library books?|storybooks?|chapter books?') },
  { key: 'world map', cat: 'classroom', re: W('world map|globe|atlas|printed map') },
  { key: 'photos', cat: 'classroom', re: W('photos?|photographs?|printouts?|pictures printed') },
  { key: 'camera', cat: 'classroom', re: W('cameras?|tablets?|ipads?') },
  { key: 'blocks', cat: 'classroom', re: W('blocks|lego|legos|building blocks') },
  { key: 'sponges', cat: 'classroom', re: W('sponges?') },
  { key: 'spoons', cat: 'classroom', re: W('spoons?') },
  { key: 'cups', cat: 'classroom', re: W('cups?') },
  { key: 'jars', cat: 'classroom', re: W('(?:glass|plastic|clear|mason|empty) jars?') },
  { key: 'boxes', cat: 'free', re: W('boxes|box|cardboard|shoeboxes|shoebox|cereal boxes?|tissue boxes?') },
  { key: 'containers', cat: 'free', re: W('containers?|tubs?|egg cartons?|bottles?|bottle caps?|tin cans?|soda cans?|jar lids?') },
  { key: 'found objects', cat: 'free', re: W('found objects?|leaves|leaf|rocks?|sticks|pinecones?|pebbles?|acorns?|twigs?') },
  { key: 'water', cat: 'free', re: /\bwater(?:ing)?\b(?!proof)/i },
  { key: 'board', cat: 'free', re: /\b(?:white|chalk|dry-erase)? ?board\b(?! games?)(?<!card ?board)(?<!bulletin board)/i },
  { key: 'bulletin board', cat: 'classroom', re: W('bulletin boards?') },
  { key: 'timer', cat: 'free', re: W('timers?|stopwatch(?:es)?|clock|sand ?timers?') },
  { key: 'blindfold', cat: 'classroom', re: W('blindfolds?') },

  // art-closet supplies most elementary schools already have
  { key: 'clay', cat: 'classroom', re: W('clay|play-?doh|playdough|modeling dough|salt dough') },
  { key: 'paint', cat: 'classroom', re: W('paints?|tempera|watercolou?rs?|paint ?brush(?:es)?|brushes') },
  { key: 'beads', cat: 'classroom', re: W('beads?') },
  { key: 'felt', cat: 'classroom', re: /\bfelt(?![- ]?tips?)(?:\s+squares?)?\b/i },
  { key: 'fabric', cat: 'classroom', re: W('fabric|cloth|ribbon|lace|burlap') },
  { key: 'pipe cleaners', cat: 'classroom', re: W('pipe ?cleaners?|pom-?poms?|googly eyes|sequins?|glitter') },
  { key: 'stickers', cat: 'classroom', re: W('stickers?|sticky dots?|dot stickers?|star stickers?') },
  { key: 'straws', cat: 'classroom', re: W('straws?|cotton balls?|foil|aluminum|toothpicks?') },

  // things a school has to buy
  { key: 'soil', cat: 'buy', re: W('soil|potting mix|dirt') },
  { key: 'seeds', cat: 'buy', re: /(?<!paper )\b(?:seeds?|seed packets?)\b/i },
  { key: 'food', cat: 'buy', re: PRETEND('food|snacks?|cookies?|crackers?|cereal|raisins?|pretzels?|candy|lemons?|lemonade|sugar|flour|fruit|apples?|bread|milk|juice|trail mix|spices?|cinnamon|cloves|peppercorns?|garlic|herbs?|vegetables?|tomatoes|lettuce|carrots?') },
  { key: 'mortar', cat: 'buy', re: W('mortar(?: and pestle)?|pestle') },
];

const NEGATION = /(?:\bno|\bnot|\bwithout|\binstead of|\bskip|\bnever|\bdon'?t need|\bno need for)\s+(?:\w+\s+){0,2}$/i;
const FREE_MARK = /\b(free|from home|recycled|scrap|brought in|donated|already in the room|cut from (?:plain |scrap )?paper|made from (?:plain |scrap )?paper|drawn on)\b/i;

function mentions(textStr, withNegation = false) {
  // returns Set of keys mentioned (non-negated). Specific kinds consume their span.
  const found = new Set();
  let s = ' ' + textStr + ' ';
  for (const v of VOCAB) {
    const re = new RegExp(v.re.source, v.re.flags.includes('g') ? v.re.flags : v.re.flags + 'g');
    let m;
    const spans = [];
    while ((m = re.exec(s))) {
      if (m[0].length === 0) { re.lastIndex++; continue; }
      const before = s.slice(Math.max(0, m.index - 40), m.index);
      const negated = NEGATION.test(before);
      if (!negated || withNegation) found.add(v.key);
      spans.push([m.index, m.index + m[0].length]);
    }
    // blank out matched spans so generic keys do not re-match them
    for (const [a, b] of spans.reverse()) s = s.slice(0, a) + ' '.repeat(b - a) + s.slice(b);
  }
  return found;
}

function negatedMentions(textStr) {
  const out = new Set();
  const s = ' ' + textStr + ' ';
  for (const v of VOCAB) {
    const re = new RegExp(v.re.source, v.re.flags + 'g');
    let m;
    while ((m = re.exec(s))) {
      if (m[0].length === 0) { re.lastIndex++; continue; }
      const before = s.slice(Math.max(0, m.index - 40), m.index);
      if (/(?:\bno|\bnot|\bwithout|\bnever|\bnothing)\s+(?:\w+\s+){0,2}$/i.test(before)) out.add(v.key);
    }
  }
  if (/\bno (?:real )?planting\b/i.test(s)) { out.add('soil'); out.add('seeds'); }
  if (/\bno (?:real )?food\b|\bnothing (?:here )?is edible\b/i.test(s)) out.add('food');
  return out;
}

const itemName = (line) => line.split(/\s+[—–-]\s+/)[0];
const itemKeys = (line) => {
  const keys = mentions(itemName(line), true);
  if ([...keys].some(k => k !== 'paper') && keys.has('paper')) keys.delete('paper');
  return keys;
};
const PAPER_KINDS = new Set(['chart paper', 'construction paper', 'cardstock', 'grid paper', 'newspaper', 'scrap paper', 'paper']);

// ---------------------------------------------------------------------------
const en = (v) => (typeof v === 'string' ? v : v?.en) ?? '';
const LAYERS = (budget, tier1) => [
  ...(budget === 'fromScratch' ? ['fromScratch'] : []),
  ...(tier1 ? ['tier1'] : []),
  ...(budget === 'fromScratch' && tier1 ? ['tier1FromScratch'] : []),
];
function resolve(tv, budget, tier1) {
  const use = LAYERS(budget, tier1);
  let beforeClass = en(tv.beforeClass), runningLongOrShort = en(tv.runningLongOrShort);
  for (const l of use) {
    const v = tv.variants?.[l];
    if (v?.beforeClass) beforeClass = en(v.beforeClass);
    if (v?.runningLongOrShort) runningLongOrShort = en(v.runningLongOrShort);
  }
  const steps = tv.steps.map((st) => {
    const r = { title: st.title, duration: st.duration, description: en(st.description), sayThis: en(st.sayThis), watchFor: en(st.watchFor), doneWhen: en(st.doneWhen) };
    for (const l of use) {
      const v = st.variants?.[l];
      if (!v) continue;
      for (const k of ['title', 'description', 'sayThis', 'watchFor', 'doneWhen']) if (en(v[k])) r[k] = en(v[k]);
    }
    return r;
  });
  return { beforeClass, runningLongOrShort, steps };
}

const findings = [];
function flag(code, a, version, budget, where, detail) {
  const f = { code, season: a.season, chapter: a.chapter, version, budget, where, detail };
  const ign = IGNORES.find(i => i.code === code && i.season === a.season && i.chapter === a.chapter
    && (!i.version || i.version === version) && (!i.budget || i.budget === budget)
    && (!i.match || (detail + ' ' + where).includes(i.match)));
  if (ign) { f.ignored = ign.reason; }
  findings.push(f);
}

const BUDGETS = ['fromScratch', 'basicClassroom'];
const BUDGET_LABEL = { fromScratch: 'From Scratch', basicClassroom: 'Basic Classroom' };
const DOLLARS = /\$\s?(\d[\d,]*(?:\.\d+)?)/g;
const HARD_K1 = [
  [/\bdivid\w*|\bdivision\b|÷/i, 'division'],
  [/\baudit\w*/i, 'audit'],
  [/\bpercent\w*|\d\s?%/i, 'percent'],
  [/\baverage\b/i, 'average'],
  [/\b(?:profit )?margin\b/i, 'margin'],
  [/\bper hour\b|\/hour\b|hourly\b/i, 'hourly rate'],
];

for (const a of DATA) {
  if (ONLY_SEASON && a.season !== ONLY_SEASON) continue;
  if (ONLY_CHAPTER && a.chapter !== ONLY_CHAPTER) continue;

  // M8 chapter-level
  for (const t of ['1', '2', '3', '4']) {
    if (!a.tierDifferentiation?.[t]?.focus?.length) flag('M8', a, '-', '-', `Tier ${t} adaptations`, 'empty');
  }
  for (const [k, blk] of Object.entries(a.accommodations ?? {})) {
    if (!blk.strategies?.length) flag('M8', a, '-', '-', `accommodations.${k}`, 'empty');
  }
  const focusText = Object.values(a.tierDifferentiation).flatMap(t => t.focus).join(' \n ');
  const accomText = Object.values(a.accommodations).flatMap(b => b.strategies).join(' \n ');

  // M7 Tier 1 focus
  for (const [i, f] of (a.tierDifferentiation['1']?.focus ?? []).entries()) {
    for (const [re, why] of HARD_K1) if (re.test(f)) flag('M7', a, '-', '-', `Tier 1 focus ${i + 1}`, `${why}: "${f}"`);
    for (const m of f.matchAll(DOLLARS)) if (Number(m[1].replace(/,/g, '')) > 20) flag('M7', a, '-', '-', `Tier 1 focus ${i + 1}`, `money over $20: "${f}"`);
  }

  for (const tvKey of ['20', '30', '45']) {
    const tv = a.timeVersions[tvKey];

    // M9
    for (const field of ['bestFor', 'breakdown', 'label', 'activityName']) {
      const s = tv[field] ?? '';
      if (/\bK\s?[-–]\s?\d\b|\bgrades?\s*\d|\b\d(?:st|nd|rd|th)[- ]grade|\bkindergarten\b|\byounger students\b|\bolder students\b/i.test(s)) flag('M9', a, tvKey, '-', field, s);
    }
    // M8 extension ideas: shown on the 45-minute page only
    if (tvKey === '45' && !(tv.extensionIdeas ?? []).length) flag('M8', a, tvKey, '-', 'extensionIdeas', 'empty');

    // D3
    const titles = tv.steps.flatMap((st, i) => [[i, st.title], ...Object.values(st.variants ?? {}).map(v => [i, en(v.title)])]);
    for (const [i, t] of titles) if (/\(\s*\d+\s*min(?:ute)?s?\s*\)/i.test(t)) flag('D3', a, tvKey, '-', `step ${i + 1} title`, t);

    // D2 on every description (base + variants)
    tv.steps.forEach((st, i) => {
      const descs = [en(st.description), ...Object.values(st.variants ?? {}).map(v => en(v.description))].filter(Boolean);
      for (const d of descs) {
        for (const m of d.matchAll(/\s-\s/g)) {
          const before = d.slice(0, m.index);
          const after = d.slice(m.index + m[0].length);
          const insideParens = (before.split('(').length - before.split(')').length) > 0;
          const betweenNumbers = /[\d$¢]\s*$/.test(before) && /^\s*[\d$]/.test(after);
          const beforeEquals = /^[\w\s()$]{1,40}=/.test(after);
          if (insideParens || betweenNumbers || beforeEquals) {
            flag('D2', a, tvKey, '-', `step ${i + 1} description`, `dash may split a math expression: "…${d.slice(Math.max(0, m.index - 30), m.index + 30)}…"`);
          }
        }
        if (d.includes('```')) flag('D2', a, tvKey, '-', `step ${i + 1} description`, 'code block in description');
      }
    });

    for (const budget of BUDGETS) {
      const mat = tv.materials?.[budget];
      if (!mat) { flag('M2', a, tvKey, budget, 'materials', 'list missing'); continue; }
      const items = mat.items ?? [];
      const views = [false, true].map(tier1 => ({ tier1, r: resolve(tv, budget, tier1) }));

      // text blocks
      const blocks = [];
      for (const { tier1, r } of views) {
        const tag = tier1 ? ' (Tier 1)' : '';
        blocks.push([`Before class${tag}`, r.beforeClass], [`Running long or short${tag}`, r.runningLongOrShort]);
        r.steps.forEach((st, i) => {
          for (const k of ['description', 'sayThis', 'watchFor', 'doneWhen']) blocks.push([`step ${i + 1} ${k}${tag}`, st[k]]);
        });
      }

      // M5
      for (const { tier1, r } of views) {
        const tag = tier1 ? ' (Tier 1 view)' : '';
        if (!r.beforeClass) flag('M5', a, tvKey, budget, `Before class${tag}`, 'missing');
        if (!r.runningLongOrShort) flag('M5', a, tvKey, budget, `Running long or short${tag}`, 'missing');
        r.steps.forEach((st, i) => {
          const miss = ['sayThis', 'watchFor', 'doneWhen'].filter(k => !st[k]);
          if (miss.length) flag('M5', a, tvKey, budget, `step ${i + 1}${tag}`, `missing ${miss.join(', ')}`);
        });
      }

      // M1: every item mentioned in the teacher-facing steps and notes
      const itemKeySets = items.map(itemKeys);
      const listed = new Set(itemKeySets.flatMap(s => [...s]));
      const listedPaper = [...listed].some(k => PAPER_KINDS.has(k));
      const usedKeys = new Map();
      for (const [where, txt] of blocks) {
        for (const k of mentions(txt)) {
          if (!usedKeys.has(k)) usedKeys.set(k, where);
        }
      }
      for (const [k, where] of usedKeys) {
        if (listed.has(k)) continue;
        if (k === 'paper' && listedPaper) continue;
        flag('M1', a, tvKey, budget, where, `"${k}" is used but not in the ${BUDGET_LABEL[budget]} list`);
      }

      // M2: every list item must be used somewhere on this version's page
      const extra = [...tv.discussionQuestions, ...(tvKey === '45' ? tv.extensionIdeas : []), focusText, accomText].join(' \n ');
      const allUse = new Set([...usedKeys.keys(), ...mentions(extra)]);
      const anyPaperUse = [...allUse].some(k => PAPER_KINDS.has(k));
      items.forEach((line, i) => {
        const keys = itemKeySets[i];
        if (!/\s[—–]\s/.test(line)) flag('M2', a, tvKey, budget, `item ${i + 1}`, `not in "Name — quantity, what it's for" form: "${line}"`);
        if (keys.size === 0) { flag('M2', a, tvKey, budget, `item ${i + 1}`, `checker cannot tell what this item is (add it to VOCAB or rename): "${line}"`); return; }
        // a specific paper kind counts as used when the text just says "paper"
        const used = [...keys].some(k => allUse.has(k) || (PAPER_KINDS.has(k) && allUse.has('paper')) || (k === 'paper' && anyPaperUse));
        if (!used) flag('M2', a, tvKey, budget, `item ${i + 1}`, `never used in this version: "${line}"`);
      });

      // M3
      items.forEach((line, i) => {
        for (const k of itemKeys(line)) {
          const v = VOCAB.find(x => x.key === k);
          const marked = FREE_MARK.test(line);
          if (budget === 'fromScratch') {
            if (v.cat === 'buy') flag('M3', a, tvKey, budget, `item ${i + 1}`, `From Scratch lists a buy item (${k}): "${line}"`);
            else if (v.cat === 'classroom' && !marked) flag('M3', a, tvKey, budget, `item ${i + 1}`, `From Scratch lists a classroom supply (${k}) that is not marked free: "${line}"`);
          } else if (v.cat === 'buy' && !['soil', 'seeds'].includes(k)) {
            flag('M3', a, tvKey, budget, `item ${i + 1}`, `Basic Classroom lists an item a school must buy (${k}): "${line}"`);
          }
        }
      });
      if (budget === 'fromScratch') {
        for (const [k, where] of usedKeys) {
          const v = VOCAB.find(x => x.key === k);
          if (v.cat === 'buy') flag('M3', a, tvKey, budget, where, `From Scratch text uses a buy item (${k})`);
        }
      }

      // M4
      const neg = negatedMentions(mat.description);
      for (const k of neg) if (usedKeys.has(k)) flag('M4', a, tvKey, budget, 'description', `says no ${k}, but ${usedKeys.get(k)} uses it: "${mat.description}"`);
      for (const k of mentions(mat.description)) {
        if (listed.has(k) || (k === 'paper' && listedPaper)) continue;
        if (/\balready in the room\b|\bfrom the room\b/i.test(mat.description) && VOCAB.find(x => x.key === k).cat !== 'buy') continue;
        flag('M4', a, tvKey, budget, 'description', `names ${k}, which is not in the list: "${mat.description}"`);
      }
      const costs = [...(mat.costPerStudent ?? '').matchAll(DOLLARS)].map(m => Number(m[1].replace(/,/g, '')));
      if (!mat.costPerStudent) flag('M4', a, tvKey, budget, 'costPerStudent', 'missing');
      if (budget === 'fromScratch' && costs.some(c => c > 0.25)) flag('M4', a, tvKey, budget, 'costPerStudent', `From Scratch should be free or near-free: "${mat.costPerStudent}"`);
      if (budget === 'fromScratch' && costs.every(c => c === 0) && items.some(l => [...itemKeys(l)].some(k => VOCAB.find(x => x.key === k).cat === 'buy'))) flag('M4', a, tvKey, budget, 'costPerStudent', `says $0 but the list has buy items`);
      if (budget === 'basicClassroom' && costs.every(c => c === 0) && items.some(l => /\b(soil|seeds?)\b/i.test(itemName(l)) && !FREE_MARK.test(l))) flag('M4', a, tvKey, budget, 'costPerStudent', `says $0 but soil or seeds are listed and not marked free`);

      // M6 and M7 over this version's text
      const cross = /\b(?:same|as in|like|from|see|follow)\s+(?:as\s+)?(?:the\s+)?(?:\d\d|twenty|thirty|forty-five)[- ]min(?:ute)?s?(?: version| plan| activity)?\b|\b(?:other|previous|longer|shorter) version\b|\bfollow (?:the )?same (?:\w+ )?steps\b/i;
      for (const [where, txt] of blocks) if (cross.test(txt)) flag('M6', a, tvKey, budget, where, `"${txt.match(cross)[0]}"`);
      for (const [where, txt] of [...tv.discussionQuestions.map((q, i) => [`discussion ${i + 1}`, q]), ...(tvKey === '45' ? tv.extensionIdeas.map((q, i) => [`extension ${i + 1}`, q]) : [])]) {
        if (cross.test(txt)) flag('M6', a, tvKey, budget, where, `"${txt.match(cross)[0]}"`);
      }
      const t1 = views[1].r;
      const t1blocks = [['Before class', t1.beforeClass], ['Running long or short', t1.runningLongOrShort], ...t1.steps.flatMap((st, i) => ['title', 'description', 'sayThis', 'watchFor', 'doneWhen'].map(k => [`step ${i + 1} ${k}`, st[k]]))];
      for (const [where, txt] of t1blocks) {
        if (!txt) continue;
        for (const [re, why] of HARD_K1) if (re.test(txt)) flag('M7', a, tvKey, budget, `${where} (Tier 1 view)`, `${why}: "${txt.match(re)[0]}"`);
        for (const m of txt.matchAll(DOLLARS)) if (Number(m[1].replace(/,/g, '')) > 20) { flag('M7', a, tvKey, budget, `${where} (Tier 1 view)`, `money over $20: "${m[0]}"`); break; }
        if (/Tier 1 \(K-1\):/.test(txt)) flag('M7', a, tvKey, budget, `${where} (Tier 1 view)`, 'side note "Tier 1 (K-1): ..." instead of a Tier 1 rewrite');
      }
    }
  }
}

// D1: the page must render one materials list
const page = fs.readFileSync(path.join(ROOT, 'src/ActivityDetail.tsx'), 'utf8');
const listRenders = (page.match(/\.items\.map\(/g) ?? []).length;
if (listRenders !== 1 || /timeVersion\.materials\.map|budgetTiers/.test(page)) {
  findings.push({ code: 'D1', season: 0, chapter: 0, version: '-', budget: '-', where: 'src/ActivityDetail.tsx', detail: `materials list rendered ${listRenders} times` });
}

// ---------------------------------------------------------------------------
const CODES = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'D1', 'D2', 'D3'];
const open = findings.filter(f => !f.ignored);
const table = Object.fromEntries(CODES.map(c => [c, [1, 2, 3, 4].map(s => open.filter(f => f.code === c && (f.season === s || (f.season === 0 && s === 1))).length)]));

if (!QUIET) {
  for (const f of open) console.log(`${f.code} S${f.season} Ch${f.chapter} ${f.version}${f.version !== '-' ? 'min' : ''} ${f.budget !== '-' ? BUDGET_LABEL[f.budget] : ''} | ${f.where} | ${f.detail}`);
}
console.log('\nCheck | S1 | S2 | S3 | S4 | Total');
for (const c of CODES) console.log(`${c}    | ${table[c].join(' | ')} | ${table[c].reduce((x, y) => x + y, 0)}`);
console.log(`Open: ${open.length}. Ignored with a reason: ${findings.length - open.length}.`);
if (JSON_OUT) fs.writeFileSync(JSON_OUT, JSON.stringify({ table, findings }, null, 1));
process.exit(open.length ? 1 : 0);
