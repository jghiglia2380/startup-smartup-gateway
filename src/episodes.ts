// Lookups over episodesData.json, shared by Dashboard and DaytimeInstruction.
//
// episodesData.json is exported from Supabase pe_episodes joined to pe_chapters
// through season_number (NOT pe_seasons.id, which is offset by one).

import episodesData from './episodesData.json';

export interface Episode {
  thumbnail_url: string;
  vimeo_id: string | null;
  duration_seconds: number | null;
}

type Lang = 'en' | 'es';

const episodes = episodesData.episodes as Record<
  string,
  Record<string, Record<string, Record<string, Episode>>>
>;
const chapterTitles = episodesData.chapterTitles as Record<string, Record<string, string>>;

// Season 1 keeps its own hand-written bilingual topics; Seasons 2-4 have no
// topic anywhere in Supabase, so they fall back to the chapter title.
const season1Topics: { en: string; es: string }[] = [
  { en: 'Understanding Money', es: 'Entendiendo el Dinero' },
  { en: 'Earning and Spending', es: 'Ganar y Gastar' },
  { en: 'Setting Goals', es: 'Establecer Metas' },
  { en: 'Making Choices', es: 'Tomar Decisiones' },
  { en: 'Saving Strategies', es: 'Estrategias de Ahorro' },
  { en: 'Counting Coins', es: 'Contando Monedas' },
  { en: 'Planning Ahead', es: 'Planificar con Anticipación' },
  { en: 'Following Instructions', es: 'Seguir Instrucciones' },
  { en: 'Problem Solving', es: 'Resolver Problemas' },
  { en: 'Borrowing & Responsibility', es: 'Préstamos y Responsabilidad' },
  { en: 'Giving & Sharing', es: 'Dar y Compartir' },
  { en: 'Celebrating Success', es: 'Celebrando el Éxito' },
];

export function getEpisode(
  season: number,
  chapter: number,
  tier: number,
  lang: Lang,
): Episode | undefined {
  return episodes[String(season)]?.[String(chapter)]?.[String(tier)]?.[lang];
}

export function getThumbnailUrl(
  season: number,
  chapter: number,
  tier: number,
  lang: Lang,
): string {
  return getEpisode(season, chapter, tier, lang)?.thumbnail_url ?? '';
}

/** "8:33", or "—" when the source has no duration. */
export function getDuration(
  season: number,
  chapter: number,
  tier: number,
  lang: Lang,
): string {
  const secs = getEpisode(season, chapter, tier, lang)?.duration_seconds;
  if (secs == null || secs <= 0) return '—';
  const mins = Math.floor(secs / 60);
  return `${mins}:${String(Math.round(secs % 60)).padStart(2, '0')}`;
}

/** Chapter title from pe_chapters, re-cased to title case. English only. */
export function getChapterTitle(season: number, chapter: number): string {
  return chapterTitles[String(season)]?.[String(chapter)] ?? '';
}

/** Card label: a Season 1 topic, or the chapter title for Seasons 2-4. */
export function getChapterLabel(season: number, chapter: number, lang: Lang): string {
  if (season === 1) return season1Topics[chapter - 1]?.[lang] ?? '';
  return getChapterTitle(season, chapter);
}
