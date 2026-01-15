import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, FileText, Scissors, Globe, BookOpen, ArrowLeft, ChevronDown } from 'lucide-react';
import ActivityDetail from './ActivityDetail';

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

interface Season {
  id: number;
  en: string;
  es: string;
}

// --- DATA CONFIGURATION ---

// Seasons
const seasons: Season[] = [
  { id: 1, en: "Adventures in Discovery", es: "Aventuras en Descubrimiento" },
  { id: 2, en: "Journey to Wonder", es: "Viaje a la Maravilla" },
  { id: 3, en: "Makers and Creators", es: "Creadores e Inventores" },
  { id: 4, en: "Community and Legacy", es: "Comunidad y Legado" }
];

// Video durations by chapter and tier [tier1, tier2, tier3, tier4]
const videoDurations: { [key: number]: string[] } = {
  1: ["8:33", "8:34", "8:45", "9:40"],
  2: ["8:49", "9:58", "9:01", "9:53"],
  3: ["10:22", "9:18", "10:27", "11:29"],
  4: ["10:15", "8:41", "9:17", "10:54"],
  5: ["8:58", "9:29", "9:15", "10:30"],
  6: ["8:31", "8:50", "9:27", "9:42"],
  7: ["9:16", "9:27", "9:45", "10:11"],
  8: ["8:51", "9:08", "8:27", "9:02"],
  9: ["10:16", "9:34", "8:26", "8:42"],
  10: ["9:03", "8:34", "9:28", "9:00"],
  11: ["10:43", "8:43", "7:07", "8:55"],
  12: ["9:27", "9:43", "7:04", "8:53"]
};

// The 12 Chapters with Bilingual Topics
const chapterData: Chapter[] = [
  { id: 1, en: "Understanding Money", es: "Entendiendo el Dinero" },
  { id: 2, en: "Earning and Spending", es: "Ganar y Gastar" },
  { id: 3, en: "Setting Goals", es: "Establecer Metas" },
  { id: 4, en: "Making Choices", es: "Tomar Decisiones" },
  { id: 5, en: "Saving Strategies", es: "Estrategias de Ahorro" },
  { id: 6, en: "Counting Coins", es: "Contando Monedas" },
  { id: 7, en: "Planning Ahead", es: "Planificar con Anticipación" },
  { id: 8, en: "Following Instructions", es: "Seguir Instrucciones" },
  { id: 9, en: "Problem Solving", es: "Resolver Problemas" },
  { id: 10, en: "Borrowing & Responsibility", es: "Préstamos y Responsabilidad" },
  { id: 11, en: "Giving & Sharing", es: "Dar y Compartir" },
  { id: 12, en: "Celebrating Success", es: "Celebrando el Éxito" }
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
  const [activeSeason, setActiveSeason] = useState<Season>(seasons[0]);
  const [seasonDropdownOpen, setSeasonDropdownOpen] = useState(false);
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const [activeActivity, setActiveActivity] = useState<number | null>(null);

  // Smart image URL generator
  const getThumbnailUrl = (chapterId: number): string => {
    const folder = lang === 'en' ? 'Thumbnails' : 'Thumbnails-Spanish';
    const paddedChapter = chapterId.toString().padStart(2, '0');
    return `https://raw.githubusercontent.com/jghiglia2380/project-explore-thumbnails/main/${folder}/Tier%20${activeTier.id}/Ch-${paddedChapter}-t${activeTier.id}.jpeg`;
  };

  // Get duration for current chapter and tier
  const getDuration = (chapterId: number): string => {
    return videoDurations[chapterId]?.[activeTier.id - 1] || "—";
  };

  // If viewing an activity, show ActivityDetail instead
  if (activeActivity !== null) {
    return (
      <ActivityDetail
        chapterId={activeActivity}
        tierId={activeTier.id}
        lang={lang}
        onBack={() => setActiveActivity(null)}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${activeTier.gradient} font-sans text-slate-900 transition-colors duration-500`}>

      {/* HEADER - With Creek Background */}
      <header 
        className="sticky top-0 z-30 backdrop-blur-md border-b border-white/10 shadow-lg"
        style={{
          backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.3), rgba(15, 23, 42, 0.6)), url("/startup-smartup-gateway/Creek.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-full mx-auto px-4 sm:px-8 py-4">

          {/* Top Row: Brand + Season Dropdown + Language Toggle */}
          <div className="flex justify-between items-center mb-4">
            {/* Brand + Season Selector */}
            <div className="flex items-center gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-slate-600 transition-colors"
                  aria-label="Back to Gateway"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-300" />
                </button>
              )}
              <div className="p-2 bg-emerald-600 rounded-xl">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-300 font-medium">
                  Startup Smartup
                </p>
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-white uppercase">
                  Project <span className={activeTier.accent}>Explore</span>
                </h1>
              </div>

              {/* Season Dropdown */}
              <div className="relative ml-4">
                <button
                  onClick={() => setSeasonDropdownOpen(!seasonDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors text-sm text-white"
                >
                  <span className="hidden sm:inline text-slate-400">Season 1:</span>
                  <span className="font-semibold">{activeSeason[lang]}</span>
                  <ChevronDown size={16} className={`transition-transform ${seasonDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {seasonDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">
                    {seasons.map((season) => (
                      <button
                        key={season.id}
                        onClick={() => {
                          setActiveSeason(season);
                          setSeasonDropdownOpen(false);
                        }}
                        disabled={season.id !== 1}
                        className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                          season.id === activeSeason.id 
                            ? 'bg-emerald-600 text-white' 
                            : season.id === 1 
                              ? 'text-white hover:bg-slate-800' 
                              : 'text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <span className="font-semibold">Season {season.id}:</span> {season[lang]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
              className="flex items-center gap-1 font-bold text-xs bg-slate-800/50 p-1 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
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
      <main className="max-w-full mx-auto px-4 sm:px-8 py-4">
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
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
                className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-200/80 overflow-hidden"
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
                  <div className={`absolute top-2 left-2 ${activeTier.themeDark} text-white text-xs font-black px-2 py-1 rounded-lg shadow-md`}>
                    {lang === 'en' ? 'CH' : 'CAP'} {chapter.id}
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded-md">
                    {getDuration(chapter.id)}
                  </div>

                  {/* Play Overlay */}
                  <button
                    className="absolute inset-0 flex items-center justify-center bg-black/20 [@media(hover:hover)]:bg-black/0 [@media(hover:hover)]:group-hover:bg-black/30 transition-colors duration-300"
                    aria-label={lang === 'en' ? `Play ${chapter.en}` : `Ver ${chapter.es}`}
                  >
                    <div className={`
                      w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-2xl
                      opacity-80 scale-100
                      [@media(hover:hover)]:opacity-70
                      [@media(hover:hover)]:group-hover:opacity-100
                      [@media(hover:hover)]:group-hover:scale-110
                      transition-all duration-300
                    `}>
                      <Play className={`w-6 h-6 ${activeTier.accent} ml-1`} fill="currentColor" />
                    </div>
                  </button>
                </div>

                {/* Card Body */}
                <div className="p-3">
                  <h3 className="font-bold text-sm leading-tight mb-2 text-slate-800 line-clamp-1">
                    {chapter[lang]}
                  </h3>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-white font-bold text-xs shadow-md transition-all ${activeTier.button}`}
                      aria-label={lang === 'en' ? `Play ${chapter.en}` : `Ver ${chapter.es}`}
                    >
                      <Play size={14} fill="currentColor" />
                      {lang === 'en' ? 'Play' : 'Ver'}
                    
                      <FileText size={16} />
                    </button>
                    <button
                      onClick={() => setActiveActivity(chapter.id)}
                      className="p-2 flex items-center justify-center border-2 border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 text-slate-400 hover:text-purple-600 transition-all"
                      aria-label={lang === 'en' ? 'View activity' : 'Ver actividad'}
                    >
                      <Scissors size={16} />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}