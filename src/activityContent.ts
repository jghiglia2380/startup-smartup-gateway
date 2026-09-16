// Types and lookups for activitiesData.json.
//
// Each duration (20 / 30 / 45) has its own materials list per budget level, so a
// chapter has six lists. Step text can also change by budget level and tier:
//
//   base text                     Basic Classroom, Tier 2-4
//   variants.fromScratch          From Scratch replaces those fields
//   variants.tier1                Tier 1 (K-1) replaces those fields
//   variants.tier1FromScratch     Tier 1 + From Scratch replaces those fields
//
// Later layers win, field by field.

import activitiesData from './activitiesData.json';

export type TimeKey = '20' | '30' | '45';
export type BudgetKey = 'fromScratch' | 'basicClassroom';
export type Bilingual = { en: string; es: string };

export interface MaterialsList {
  costPerStudent: string;
  description: string;
  items: string[];
}

type StepText = Partial<Record<'title' | 'description' | 'sayThis' | 'watchFor' | 'doneWhen', Bilingual | string>>;
type NoteText = Partial<Record<'beforeClass' | 'runningLongOrShort', Bilingual>>;
type Variants<T> = Partial<Record<'fromScratch' | 'tier1' | 'tier1FromScratch', T>>;

export interface Step {
  title: string;
  duration: string;
  description: Bilingual;
  sayThis?: Bilingual;
  watchFor?: Bilingual;
  doneWhen?: Bilingual;
  variants?: Variants<StepText>;
}

export interface TimeVersionData {
  label: string;
  bestFor: string;
  breakdown: string;
  activityName: string;
  materials: Record<BudgetKey, MaterialsList>;
  beforeClass?: Bilingual;
  runningLongOrShort?: Bilingual;
  variants?: Variants<NoteText>;
  steps: Step[];
  discussionQuestions: string[];
  extensionIdeas: string[];
}

export interface Activity {
  chapterId: number;
  season: number;
  chapter: number;
  activityId: string;
  title: Bilingual;
  chapterTitle: Bilingual;
  topic: Bilingual;
  description: { en: string | null; es: string | null };
  timeVersions: Record<TimeKey, TimeVersionData>;
  tierDifferentiation: Record<'1' | '2' | '3' | '4', { gradeLevel: string; focus: string[] }>;
  accommodations: Record<string, { label: string; strategies: string[] }>;
}

export const activities = activitiesData.activities as unknown as Activity[];

export interface ResolvedStep {
  title: string;
  duration: string;
  description: string;
  sayThis: string;
  watchFor: string;
  doneWhen: string;
}

export interface ResolvedVersion {
  beforeClass: string;
  runningLongOrShort: string;
  steps: ResolvedStep[];
  materials: MaterialsList;
}

const text = (v: Bilingual | string | undefined): string =>
  (typeof v === 'string' ? v : v?.en) ?? '';

function layers(budget: BudgetKey, tierId: number): Array<'fromScratch' | 'tier1' | 'tier1FromScratch'> {
  const out: Array<'fromScratch' | 'tier1' | 'tier1FromScratch'> = [];
  if (budget === 'fromScratch') out.push('fromScratch');
  if (tierId === 1) out.push('tier1');
  if (budget === 'fromScratch' && tierId === 1) out.push('tier1FromScratch');
  return out;
}

/** The text a teacher sees for one duration, budget level and tier. */
export function resolveVersion(tv: TimeVersionData, budget: BudgetKey, tierId: number): ResolvedVersion {
  const use = layers(budget, tierId);

  let beforeClass = text(tv.beforeClass);
  let runningLongOrShort = text(tv.runningLongOrShort);
  for (const layer of use) {
    const v = tv.variants?.[layer];
    if (v?.beforeClass) beforeClass = text(v.beforeClass);
    if (v?.runningLongOrShort) runningLongOrShort = text(v.runningLongOrShort);
  }

  const steps = tv.steps.map(step => {
    const r: ResolvedStep = {
      title: step.title,
      duration: step.duration,
      description: text(step.description),
      sayThis: text(step.sayThis),
      watchFor: text(step.watchFor),
      doneWhen: text(step.doneWhen),
    };
    for (const layer of use) {
      const v = step.variants?.[layer];
      if (!v) continue;
      for (const key of ['title', 'description', 'sayThis', 'watchFor', 'doneWhen'] as const) {
        if (v[key]) r[key] = text(v[key]);
      }
    }
    return r;
  });

  return { beforeClass, runningLongOrShort, steps, materials: tv.materials[budget] };
}
