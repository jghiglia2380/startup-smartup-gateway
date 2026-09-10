import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getChapterLabel, getThumbnailUrl } from './episodes';
import {
  ArrowLeft,
  BookOpen,
  Download,
  Printer,
  Eye,
  PlayCircle,
  FileText,
  Users,
  CheckSquare,
  Send,
  Award,
  Globe,
  Play,
  MessageCircle,
  Scissors,
  Star
} from 'lucide-react';

interface DaytimeInstructionProps {
  chapterId: number;
  season: number;
  tierId: number;
  lang: 'en' | 'es';
  onBack: () => void;
}

type TabType = 'teacher' | 'student' | 'assessment' | 'family' | 'standards';

interface TierColors {
  bg: string;
  text: string;
  border: string;
  themeDark: string;
  gradient: string;
}

interface DocumentCardProps {
  title: string;
  subtitle?: string;
  pageCount?: number;
  badge?: string;
  onPreview: () => void;
  onDownload: () => void;
  onPrint: () => void;
  colors: TierColors;
}

const seasons: { id: number; en: string; es: string }[] = [
  { id: 1, en: "Adventures in Discovery", es: "Aventuras en Descubrimiento" },
  { id: 2, en: "Journey to Wonder", es: "Viaje a la Maravilla" },
  { id: 3, en: "Makers and Creators", es: "Creadores e Inventores" },
  { id: 4, en: "Community and Legacy", es: "Comunidad y Legado" }
];

// Tier configuration
const getTierConfig = (tierId: number): TierColors => {
  const configs: Record<number, TierColors> = {
    1: {
      bg: 'bg-amber-500',
      text: 'text-amber-600',
      border: 'border-amber-300',
      themeDark: 'bg-amber-600',
      gradient: 'from-amber-50 via-white to-amber-50/30'
    },
    2: {
      bg: 'bg-orange-500',
      text: 'text-orange-600',
      border: 'border-orange-300',
      themeDark: 'bg-orange-600',
      gradient: 'from-orange-50 via-white to-orange-50/30'
    },
    3: {
      bg: 'bg-emerald-500',
      text: 'text-emerald-600',
      border: 'border-emerald-300',
      themeDark: 'bg-emerald-700',
      gradient: 'from-emerald-50 via-white to-emerald-50/30'
    },
    4: {
      bg: 'bg-indigo-500',
      text: 'text-indigo-600',
      border: 'border-indigo-300',
      themeDark: 'bg-indigo-700',
      gradient: 'from-indigo-50 via-white to-indigo-50/30'
    }
  };
  return configs[tierId] || configs[1];
};

const getTierGrade = (tierId: number): string => {
  const grades: Record<number, string> = {
    1: 'K-1',
    2: 'Grade 2',
    3: 'Grade 3',
    4: 'Grade 4'
  };
  return grades[tierId] || 'K-1';
};

// Document Card Component
function DocumentCard({ title, subtitle, pageCount, badge, onPreview, onDownload, onPrint, colors }: DocumentCardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow border-l-4 ${colors.border}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 ${colors.bg} rounded-lg flex-shrink-0`}>
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <h4 className="font-semibold text-slate-800 text-sm">{title}</h4>
              {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
            </div>
            {pageCount && (
              <span className="text-xs px-2 py-1 bg-slate-100 rounded-full text-slate-600 flex-shrink-0">
                {pageCount} {pageCount === 1 ? 'page' : 'pages'}
              </span>
            )}
          </div>
          {badge && (
            <span className={`inline-block text-xs px-2 py-0.5 ${colors.bg} text-white rounded-full mt-1`}>
              {badge}
            </span>
          )}
          <div className="flex gap-2 mt-3">
            <button
              onClick={onPreview}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
            >
              <Eye size={14} />
              Preview
            </button>
            <button
              onClick={onDownload}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium ${colors.bg} hover:opacity-90 text-white rounded-lg transition-opacity`}
            >
              <Download size={14} />
              Download PDF
            </button>
            <button
              onClick={onPrint}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg transition-colors"
            >
              <Printer size={14} />
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DaytimeInstruction({ chapterId, season, tierId, lang, onBack }: DaytimeInstructionProps) {
  const [activeTab, setActiveTab] = useState<TabType>('teacher');
  const [localLang, setLocalLang] = useState<'en' | 'es'>(lang);

  const colors = getTierConfig(tierId);
  const chapterLabel = getChapterLabel(season, chapterId, localLang);
  const seasonInfo = seasons[season - 1] ?? seasons[0];
  const thumbnail = getThumbnailUrl(season, chapterId, tierId, localLang);

  const handlePreview = () => {
    console.log('Preview clicked');
  };

  const handleDownload = () => {
    console.log('Download clicked');
  };

  const handlePrint = () => {
    window.print();
  };

  const tabs: Array<{ id: TabType; label: string; labelEs: string; icon: React.ReactNode }> = [
    { id: 'teacher', label: 'Teacher Materials', labelEs: 'Materiales del Maestro', icon: <BookOpen size={16} /> },
    { id: 'student', label: 'Student Packs', labelEs: 'Paquetes de Estudiantes', icon: <Users size={16} /> },
    { id: 'assessment', label: 'Assessment', labelEs: 'Evaluación', icon: <CheckSquare size={16} /> },
    { id: 'family', label: 'Family Connection', labelEs: 'Conexión Familiar', icon: <Send size={16} /> },
    { id: 'standards', label: 'Standards', labelEs: 'Estándares', icon: <Award size={16} /> }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.gradient} font-sans text-slate-900`}>
      {/* HEADER - Creek Background */}
      <header
        className="sticky top-0 z-30 backdrop-blur-md border-b border-white/10 shadow-lg"
        style={{
          backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.3), rgba(15, 23, 42, 0.6)), url("/startup-smartup-gateway/Creek.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-full mx-auto px-4 sm:px-8 py-4">
          <div className="flex justify-between items-center mb-3">
            {/* Brand + Breadcrumb */}
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-slate-600 transition-colors"
                aria-label="Back to Dashboard"
              >
                <ArrowLeft className="w-5 h-5 text-slate-300" />
              </button>
              <div className="p-2 bg-emerald-600 rounded-xl">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-300 font-medium">
                  Project Explore / Daytime Instruction
                </p>
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  {chapterLabel}
                </h1>
              </div>
            </div>

            {/* Language Toggle */}
            <button
              onClick={() => setLocalLang(localLang === 'en' ? 'es' : 'en')}
              className="flex items-center gap-1 font-bold text-xs bg-slate-800/50 p-1 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
              aria-label={localLang === 'en' ? 'Switch to Spanish' : 'Cambiar a Inglés'}
            >
              <span className={`px-3 py-1.5 rounded transition-all ${localLang === 'en' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>
                EN
              </span>
              <span className={`px-3 py-1.5 rounded transition-all ${localLang === 'es' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>
                ES
              </span>
            </button>
          </div>

          {/* Tier Badge + Context */}
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <span className={`${colors.bg} text-white px-3 py-1 rounded-lg font-bold`}>
              Tier {tierId} • {getTierGrade(tierId)}
            </span>
            <span className="text-slate-600">•</span>
            <span>Season {season}: {seasonInfo[localLang]}</span>
            <span className="text-slate-600">•</span>
            <Globe size={12} />
            <span>{localLang === 'en' ? 'English' : 'Español'}</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT - Two Panel Layout */}
      <main className="max-w-full mx-auto px-4 sm:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* LEFT PANEL - Sticky */}
          <div className="w-full lg:w-[40%] lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto space-y-4">
            {/* Hero Thumbnail */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="aspect-video bg-slate-100 relative overflow-hidden">
                <img
                  src={thumbnail}
                  className="w-full h-full object-cover"
                  alt={chapterLabel}
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?auto=format&fit=crop&w=800";
                  }}
                />
                <div className={`absolute top-3 left-3 ${colors.themeDark} text-white text-sm font-black px-3 py-1.5 rounded-lg shadow-md`}>
                  {localLang === 'en' ? 'CH' : 'CAP'} {chapterId}
                </div>
              </div>
              <div className="p-4">
                <h2 className="font-bold text-lg text-slate-800 mb-1">{chapterLabel}</h2>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="px-2 py-1 bg-slate-100 rounded-full">Season {season}</span>
                  <span className={`px-2 py-1 ${colors.bg} text-white rounded-full font-semibold`}>
                    Tier {tierId}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Video Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="p-4 border-b border-slate-200">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <PlayCircle className={colors.text} size={18} />
                  {localLang === 'en' ? 'Now Playing' : 'Reproduciendo Ahora'}
                </h3>
              </div>
              <div className={`aspect-video bg-gradient-to-br ${colors.gradient} flex items-center justify-center relative border-4 ${colors.border} animate-pulse`}>
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-20 h-20 ${colors.bg} rounded-full mb-3 shadow-lg`}>
                    <Play className="w-10 h-10 text-white ml-1" fill="currentColor" />
                  </div>
                  <p className="text-sm font-medium text-slate-600">
                    {localLang === 'en' ? 'Episode video will load here' : 'El video del episodio se cargará aquí'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 5-Day Lesson Arc */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-5"
            >
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <BookOpen className={colors.text} size={18} />
                {localLang === 'en' ? '5-Day Lesson Arc' : 'Arco de Lección de 5 Días'}
              </h3>
              <div className="space-y-3">
                {[
                  { day: 1, icon: Play, en: 'Launch vocabulary + watch episode', es: 'Lanzar vocabulario + ver episodio' },
                  { day: 2, icon: MessageCircle, en: 'Vocabulary deepening + partner discussion', es: 'Profundización de vocabulario + discusión en pareja' },
                  { day: 3, icon: Scissors, en: 'Arts & crafts extension activity', es: 'Actividad de extensión de artes y manualidades' },
                  { day: 4, icon: BookOpen, en: `Phonological awareness (K-1) / Reading passage (2-4)`, es: 'Conciencia fonológica (K-1) / Pasaje de lectura (2-4)' },
                  { day: 5, icon: Star, en: 'Share + portfolio reflection', es: 'Compartir + reflexión del portafolio' }
                ].map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={item.day} className="flex gap-3 items-start">
                      <div className={`flex-shrink-0 ${colors.bg} rounded-lg p-2`}>
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-500 mb-0.5">
                          {localLang === 'en' ? `Day ${item.day}` : `Día ${item.day}`}
                        </p>
                        <p className="text-sm text-slate-700">{item[localLang]}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* RIGHT PANEL - Scrollable Tabs */}
          <div className="flex-1 space-y-4 overflow-y-auto">
            {/* Tab Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-2"
            >
              <div className="flex overflow-x-auto scrollbar-hide gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? `${colors.bg} text-white shadow-md`
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab[localLang === 'en' ? 'label' : 'labelEs']}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* TAB 1: Teacher Materials */}
                {activeTab === 'teacher' && (
                  <>
                    <DocumentCard
                      title={localLang === 'en' ? 'Teacher Guide Full' : 'Guía Completa del Maestro'}
                      subtitle={localLang === 'en' ? 'Primary instructional document' : 'Documento instructivo principal'}
                      pageCount={12}
                      badge={localLang === 'en' ? 'Primary Document' : 'Documento Principal'}
                      onPreview={handlePreview}
                      onDownload={handleDownload}
                      onPrint={handlePrint}
                      colors={colors}
                    />
                    <DocumentCard
                      title={localLang === 'en' ? 'Quick Reference Card' : 'Tarjeta de Referencia Rápida'}
                      subtitle={localLang === 'en' ? '1-page lesson overview' : 'Resumen de lección de 1 página'}
                      pageCount={1}
                      onPreview={handlePreview}
                      onDownload={handleDownload}
                      onPrint={handlePrint}
                      colors={colors}
                    />
                    <DocumentCard
                      title={localLang === 'en' ? 'Vocabulary Word Cards' : 'Tarjetas de Vocabulario'}
                      subtitle={localLang === 'en' ? '4 Launch + 1 Apply words' : '4 Lanzamiento + 1 Aplicar palabras'}
                      pageCount={5}
                      onPreview={handlePreview}
                      onDownload={handleDownload}
                      onPrint={handlePrint}
                      colors={colors}
                    />
                  </>
                )}

                {/* TAB 2: Student Packs */}
                {activeTab === 'student' && (
                  <>
                    {(tierId === 1 || tierId === 2) && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                        <p className="text-sm text-amber-800">
                          <strong>{localLang === 'en' ? 'Note:' : 'Nota:'}</strong>{' '}
                          {localLang === 'en'
                            ? 'K-1 oral-first delivery — teacher-led, no independent reading'
                            : 'Entrega oral primero K-1 — dirigida por el maestro, sin lectura independiente'}
                        </p>
                      </div>
                    )}
                    <DocumentCard
                      title={localLang === 'en' ? 'Student Activity Booklet' : 'Cuadernillo de Actividades del Estudiante'}
                      subtitle={localLang === 'en' ? `Tier ${tierId} (${getTierGrade(tierId)})` : `Nivel ${tierId} (${getTierGrade(tierId)})`}
                      pageCount={8}
                      onPreview={handlePreview}
                      onDownload={handleDownload}
                      onPrint={handlePrint}
                      colors={colors}
                    />
                    <DocumentCard
                      title={localLang === 'en' ? 'Read-Aloud Backup Script' : 'Guion de Lectura en Voz Alta'}
                      subtitle={localLang === 'en' ? 'For use if video unavailable' : 'Para usar si el video no está disponible'}
                      pageCount={6}
                      onPreview={handlePreview}
                      onDownload={handleDownload}
                      onPrint={handlePrint}
                      colors={colors}
                    />
                  </>
                )}

                {/* TAB 3: Assessment */}
                {activeTab === 'assessment' && (
                  <>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                      <p className="text-sm text-blue-800">
                        <strong>{localLang === 'en' ? 'Note:' : 'Nota:'}</strong>{' '}
                        {localLang === 'en'
                          ? 'Observation-based assessment. No grading required.'
                          : 'Evaluación basada en observación. No se requiere calificación.'}
                      </p>
                    </div>
                    <DocumentCard
                      title={localLang === 'en' ? 'Observation Checklist' : 'Lista de Verificación de Observación'}
                      subtitle={localLang === 'en' ? '5 observable behaviors' : '5 comportamientos observables'}
                      pageCount={2}
                      onPreview={handlePreview}
                      onDownload={handleDownload}
                      onPrint={handlePrint}
                      colors={colors}
                    />
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                      <h4 className="font-semibold text-slate-800 mb-3">
                        {localLang === 'en' ? 'Observable Behaviors:' : 'Comportamientos Observables:'}
                      </h4>
                      <ul className="space-y-2">
                        {[
                          { en: 'Student can identify vocabulary word when heard', es: 'El estudiante puede identificar palabra de vocabulario cuando la escucha' },
                          { en: 'Student participates in partner discussion', es: 'El estudiante participa en discusión con compañero' },
                          { en: 'Student completes arts/crafts extension', es: 'El estudiante completa extensión de artes/manualidades' },
                          { en: 'Student demonstrates phonological awareness task (K-1)', es: 'El estudiante demuestra tarea de conciencia fonológica (K-1)' },
                          { en: 'Student connects story to personal experience', es: 'El estudiante conecta historia con experiencia personal' }
                        ].map((behavior, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                            <CheckSquare className={`${colors.text} flex-shrink-0 mt-0.5`} size={16} />
                            <span>{behavior[localLang]}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                {/* TAB 4: Family Connection */}
                {activeTab === 'family' && (
                  <>
                    <DocumentCard
                      title={localLang === 'en' ? 'Family Connection Letter' : 'Carta de Conexión Familiar'}
                      subtitle={localLang === 'en' ? 'Bilingual EN/ES single document' : 'Documento único bilingüe EN/ES'}
                      pageCount={2}
                      badge={localLang === 'en' ? 'Bilingual' : 'Bilingüe'}
                      onPreview={handlePreview}
                      onDownload={handleDownload}
                      onPrint={handlePrint}
                      colors={colors}
                    />
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                      <h4 className="font-semibold text-slate-800 mb-3">
                        {localLang === 'en' ? 'Letter Includes:' : 'La Carta Incluye:'}
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm text-slate-700">
                          <span className={`mt-1 w-2 h-2 rounded-full ${colors.bg} flex-shrink-0`} />
                          <span>{localLang === 'en' ? 'Vocabulary words for the week' : 'Palabras de vocabulario de la semana'}</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-slate-700">
                          <span className={`mt-1 w-2 h-2 rounded-full ${colors.bg} flex-shrink-0`} />
                          <span>{localLang === 'en' ? 'Home activity suggestion' : 'Sugerencia de actividad en casa'}</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-slate-700">
                          <span className={`mt-1 w-2 h-2 rounded-full ${colors.bg} flex-shrink-0`} />
                          <span>{localLang === 'en' ? 'Chapter summary' : 'Resumen del capítulo'}</span>
                        </li>
                      </ul>
                    </div>
                  </>
                )}

                {/* TAB 5: Standards */}
                {activeTab === 'standards' && (
                  <>
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-4">
                      <p className="text-sm text-purple-800">
                        <strong>{localLang === 'en' ? 'Note:' : 'Nota:'}</strong>{' '}
                        {localLang === 'en'
                          ? 'Aligned to Science of Reading framework'
                          : 'Alineado con el marco de Ciencia de la Lectura'}
                      </p>
                    </div>
                    <div className="space-y-4">
                      {[
                        {
                          code: 'CCSS.ELA-LITERACY.RL.K.1',
                          name: 'CCSS ELA',
                          description: 'Ask and answer questions about key details in a text',
                          descriptionEs: 'Hacer y responder preguntas sobre detalles clave en un texto'
                        },
                        {
                          code: 'CA ELD.PI.K.6',
                          name: 'CA ELD',
                          description: 'Describe ideas, phenomena, and text elements based on understanding',
                          descriptionEs: 'Describir ideas, fenómenos y elementos de texto basados en la comprensión'
                        },
                        {
                          code: 'Jump$tart K-2.1',
                          name: 'Jump$tart',
                          description: 'Understand that people earn income by working',
                          descriptionEs: 'Entender que las personas ganan ingresos trabajando'
                        },
                        {
                          code: 'CEE-K.1',
                          name: 'CEE',
                          description: 'Identify examples of choices people make',
                          descriptionEs: 'Identificar ejemplos de elecciones que las personas hacen'
                        }
                      ].map((standard, idx) => (
                        <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 ${colors.bg} rounded-lg flex-shrink-0`}>
                              <Award className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-slate-800 text-sm">{standard.name}</span>
                                <span className="text-xs px-2 py-0.5 bg-slate-100 rounded-full text-slate-600">
                                  {standard.code}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600">
                                {localLang === 'en' ? standard.description : standard.descriptionEs}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
