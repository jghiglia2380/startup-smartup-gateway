import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, FileText, CheckCircle2, Globe, BookOpen, ArrowLeft } from 'lucide-react';

interface DashboardProps {
  onBack?: () => void;
}

// --- TYPE DEFINITIONS ---
interface Chapter {
  id: number;
  en: string;
  es: string;
}

interface Tier {
  id: number;
  label: string;
  grades: string;
  theme: string;
  themeDark: string;
  accent: string;
  button: string;
  gradient: string;
  description: string;
}

// --- DATA CONFIGURATION ---

// The 12 Chapters with Bilingual Titles
const chapterData: Chapter[] = [
  { id: 1, en: "Secret Garden", es: "El Jardín Secreto" },
  { id: 2, en: "The Seed Library", es: "La Biblioteca de Semillas" },
  { id: 3, en: "The Trading Post", es: "El Puesto de Intercambio" },
  { id: 4, en: "The Creek Explorers", es: "Los Exploradores del Arroyo" },
  { id: 5, en: "Riley's Art Stand", es: "El Puesto de Arte de Riley" },
  { id: 6, en: "The Penny Hunt", es: "La Búsqueda del Centavo" },
  { id: 7, en: "The Secret Fort", es: "El Fuerte Secreto" },
  { id: 8, en: "Frances's Recipe Box", es: "La Caja de Recetas de Frances" },
  { id: 9, en: "The Repair Shop", es: "El Taller de Reparaciones" },
  { id: 10, en: "The Library Adventure", es: "La Aventura en la Biblioteca" },
  { id: 11, en: "The Giving Garden", es: "El Jardín Generoso" },
  { id: 12, en: "The Treasure Exhibition", es: "La Exhibición de Tesoros" }
];

// The 4 Grade Tiers with brand-aligned colors
const tiers: Tier[] = [
  {
    id: 1,
    label: 'Tier 1',
    grades: 'K-1',
    theme: 'bg-amber-400',
    themeDark: 'bg-amber-500',
    accent: 'text-amber-600',
    button: 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700',
    gradient: 'from-amber-50 via-white to-amber-50/30',
    description: 'Foundational vocabulary & basic social concepts.',
  },
  {
    id: 2,
    label: 'Tier 2',
    grades: '2',
    theme: 'bg-orange-400',
    themeDark: 'bg-orange-500',
    accent: 'text-orange-600',
    button: 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700',
    gradient: 'from-orange-50 via-white to-orange-50/30',
    description: 'Expanding sentence structures & community roles.',
  },
  {
    id: 3,
    label: 'Tier 3',
    grades: '3',
    theme: 'bg-emerald-500',
    themeDark: 'bg-emerald-600',
    accent: 'text-emerald-600',
    button: 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800',
    gradient: 'from-emerald-50 via-white to-emerald-50/30',
    description: 'Complex narratives & introduction to saving.',
  },
  {
    id: 4,
    label: 'Tier 4',
    grades: '4',
    theme: 'bg-indigo-500',
    themeDark: 'bg-indigo-600',
    accent: 'text-indigo-600',
    button: 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800',
    gradient: 'from-indigo-50 via-white to-indigo-50/30',
    description: 'Multi-step problem solving & project basics.',
  }
];

export default function ExploreDashboard({ onBack }: DashboardProps) {
  const [activeTier, setActiveTier] = useState<Tier>(tiers[0]);
  const [lang, setLang] = useState<'en' | 'es'>('en');

  // Smart image URL generator
  const getThumbnailUrl = (chapterId: number): string => {
    const folder = lang === 'en' ? 'Thumbnails' : 'Thumbnails-Spanish';
    const paddedChapter = chapterId.toString().padStart(2, '0');
    return `https://raw.githubusercontent.com/jghiglia2380/project-explore-thumbnails/main/${folder}/Tier%20${activeTier.id}/Ch-${paddedChapter}-t${activeTier.id}.jpeg`;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${activeTier.gradient} font-sans text-slate-900 transition-colors duration-500`}>

      {/* HEADER - Matches Gateway Brand Style */}
      <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">

          {/* Top Row: Brand + Language Toggle */}
          <div className="flex justify-between items-center mb-4">
            {/* Brand - Child of Gateway */}
            <div className="flex items-center gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-colors"
                  aria-label="Back to Gateway"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-300" />
                </button>
              )}
              <div className="p-2 bg-emerald-600 rounded-xl">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-medium">
                  Startup Smartup
                </p>
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-white uppercase">
                  Project <span className={activeTier.accent}>Explore</span>
                </h1>
              </div>
            </div>

            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
              className="flex items-center gap-1 font-bold text-xs bg-slate-800 p-1 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
              aria-label={lang === 'en' ? 'Switch to Spanish' : 'Cambiar a Inglés'}
            >
              <span className={`px-3 py-1.5 rounded transition-all ${lang === 'en' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>
                EN
              </span>
              <span className={`px-3 py-1.5 rounded transition-all ${lang === 'es' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>
                ES
              </span>
            </button>
          </div>

          {/* Tier Switcher - Pill Style */}
          <div className="flex bg-slate-800/50 p-1 rounded-2xl overflow-x-auto scrollbar-hide">
            {tiers.map((tier) => (
              <button
                key={tier.id}
                onClick={() => setActiveTier(tier)}
                className={`relative flex-1 min-w-[80px] px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap ${
                  activeTier.id === tier.id ? 'text-white' : 'text-slate-400 hover:text-white'
                }`}
                aria-pressed={activeTier.id === tier.id}
              >
                {activeTier.id === tier.id && (
                  <motion.div
                    layoutId="activeTierPill"
                    className={`absolute inset-0 ${tier.themeDark} rounded-xl shadow-lg`}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex flex-col sm:flex-row sm:gap-1 items-center">
                  <span>{tier.label}</span>
                  <span className="text-[10px] sm:text-xs opacity-80">({tier.grades})</span>
                </span>
              </button>
            ))}
          </div>

          {/* Context Bar */}
          <motion.div
            key={activeTier.id}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400"
          >
            <Globe size={12} />
            <span className="font-semibold text-white">
              {lang === 'en' ? 'English' : 'Español'}
            </span>
            <span className="text-slate-600">•</span>
            <span className={`w-2 h-2 rounded-full ${activeTier.theme}`} />
            <p className="text-slate-300">{activeTier.description}</p>
          </motion.div>
        </div>
      </header>

      {/* VIDEO GRID */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {chapterData.map((chapter) => (
              <motion.article
                key={`${activeTier.id}-${chapter.id}-${lang}`}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="group relative bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-200/80 overflow-hidden"
              >
                {/* Thumbnail Area */}
                <div className="aspect-video bg-slate-100 relative overflow-hidden">
                  {/* Color Tint Overlay */}
                  <div className={`absolute inset-0 opacity-20 ${activeTier.theme} mix-blend-multiply transition-colors duration-500`} />

                  <img
                    src={getThumbnailUrl(chapter.id)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    alt={chapter[lang]}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?auto=format&fit=crop&w=800";
                    }}
                  />

                  {/* Chapter Badge */}
                  <div className={`absolute top-3 left-3 ${activeTier.themeDark} text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-md`}>
                    {lang === 'en' ? 'CH' : 'CAP'} {chapter.id}
                  </div>

                  {/* Play Overlay - Always Visible for Touch/Smart Board, Enhanced on Hover for Mouse */}
                  <button
                    className="absolute inset-0 flex items-center justify-center bg-black/20 [@media(hover:hover)]:bg-black/0 [@media(hover:hover)]:group-hover:bg-black/30 transition-colors duration-300"
                    aria-label={lang === 'en' ? `Play ${chapter.en}` : `Ver ${chapter.es}`}
                  >
                    <div className={`
                      w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-2xl
                      opacity-80 scale-100
                      [@media(hover:hover)]:opacity-70
                      [@media(hover:hover)]:group-hover:opacity-100
                      [@media(hover:hover)]:group-hover:scale-110
                      transition-all duration-300
                    `}>
                      <Play className={`w-7 h-7 ${activeTier.accent} ml-1`} fill="currentColor" />
                    </div>
                  </button>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5">
                  <h3 className="font-bold text-base sm:text-lg leading-tight mb-3 text-slate-800 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
                    {chapter[lang]}
                  </h3>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      className={`flex-1 flex items-center justify-center gap-2 min-h-[48px] py-3 rounded-xl text-white font-bold text-sm shadow-md transition-all ${activeTier.button}`}
                      aria-label={lang === 'en' ? `Play ${chapter.en}` : `Ver ${chapter.es}`}
                    >
                      <Play size={16} fill="currentColor" />
                      {lang === 'en' ? 'Play' : 'Ver'}
                    </button>
                    <button
                      className="min-h-[48px] min-w-[48px] flex items-center justify-center border-2 border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 text-slate-400 hover:text-blue-600 transition-all"
                      aria-label={lang === 'en' ? 'View worksheet' : 'Ver hoja de trabajo'}
                    >
                      <FileText size={18} />
                    </button>
                    <button
                      className="min-h-[48px] min-w-[48px] flex items-center justify-center border-2 border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 text-slate-400 hover:text-emerald-600 transition-all"
                      aria-label={lang === 'en' ? 'Mark complete' : 'Marcar completado'}
                    >
                      <CheckCircle2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Footer Note */}
        <div className="mt-12 text-center text-sm text-slate-400">
          <p>
            {lang === 'en'
              ? `Showing all 12 chapters for ${activeTier.label} (Grades ${activeTier.grades})`
              : `Mostrando los 12 capítulos para ${activeTier.label} (Grados ${activeTier.grades})`
            }
          </p>
        </div>
      </main>
    </div>
  );
}
