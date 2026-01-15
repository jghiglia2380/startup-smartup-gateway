import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Clock, 
  DollarSign, 
  Printer, 
  CheckCircle, 
  MessageCircle,
  Scissors,
  Users,
  Lightbulb,
  BookOpen,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Import activities data
import activitiesData from './activitiesData.json';

interface ActivityDetailProps {
  chapterId: number;
  tierId: number;
  lang: 'en' | 'es';
  onBack: () => void;
}

type TimeVersion = '20' | '30' | '45';
type BudgetTier = 'standard' | 'lowCost' | 'premium';

export default function ActivityDetail({ chapterId, tierId, lang, onBack }: ActivityDetailProps) {
  const [selectedTime, setSelectedTime] = useState<TimeVersion>('30');
  const [selectedBudget, setSelectedBudget] = useState<BudgetTier>('standard');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    materials: true,
    steps: true,
    discussion: true,
    tierAdaptations: false,
    accommodations: false,
    extensionIdeas: false
  });

  // Get activity data for this chapter
  const activity = activitiesData.activities.find(a => a.chapterId === chapterId);
  
  if (!activity) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Activity not found for Chapter {chapterId}</p>
          <button onClick={onBack} className="mt-4 text-emerald-600 font-semibold">← Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const timeVersion = activity.timeVersions[selectedTime];
  const budgetInfo = activity.budgetTiers[selectedBudget];
  const tierInfo = activity.tierDifferentiation[tierId.toString() as '1' | '2' | '3' | '4'];

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handlePrint = () => {
    window.print();
  };

  // Tier colors
  const tierColors: Record<number, { bg: string; text: string; border: string }> = {
    1: { bg: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-300' },
    2: { bg: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-300' },
    3: { bg: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-300' },
    4: { bg: 'bg-indigo-500', text: 'text-indigo-600', border: 'border-indigo-300' }
  };

  const colors = tierColors[tierId] || tierColors[1];

  // Budget label mapping
  const budgetLabels: Record<BudgetTier, string> = {
    standard: 'Standard Classroom',
    lowCost: 'Low Cost',
    premium: 'Premium'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 print:bg-white">
      {/* Header */}
      <header className={`sticky top-0 z-30 ${colors.bg} text-white shadow-lg print:static print:shadow-none`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors print:hidden"
                aria-label="Back to Dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <p className="text-xs uppercase tracking-wider opacity-80">
                  Chapter {chapterId} • Tier {tierId} ({tierInfo.gradeLevel})
                </p>
                <h1 className="text-lg sm:text-xl font-bold">
                  {activity.title[lang]}
                </h1>
              </div>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors print:hidden"
            >
              <Printer size={18} />
              <span className="hidden sm:inline font-medium">Print</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Time & Budget Selectors */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6 print:hidden">
          {/* Time Selector */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={18} className={colors.text} />
              <span className="font-semibold text-slate-700">Activity Duration</span>
            </div>
            <div className="flex gap-2">
              {(['20', '30', '45'] as TimeVersion[]).map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-all ${
                    selectedTime === time
                      ? `${colors.bg} text-white shadow-md`
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {time} min
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-500">{timeVersion.bestFor}</p>
          </div>

          {/* Budget Selector */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign size={18} className={colors.text} />
              <span className="font-semibold text-slate-700">Budget Level</span>
            </div>
            <div className="flex gap-2">
              {([
                { key: 'standard', label: 'Standard' },
                { key: 'lowCost', label: 'Low Cost' },
                { key: 'premium', label: 'Premium' }
              ] as { key: BudgetTier; label: string }[]).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSelectedBudget(key)}
                  className={`flex-1 py-2 px-2 rounded-lg font-semibold text-xs sm:text-sm transition-all ${
                    selectedBudget === key
                      ? `${colors.bg} text-white shadow-md`
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {budgetInfo.costPerStudent}/student • {budgetInfo.description}
            </p>
          </div>
        </div>

        {/* Print Header - Only shows when printing */}
        <div className="hidden print:block mb-6 border-b-2 border-slate-300 pb-4">
          <h2 className="text-xl font-bold">{activity.title.en}</h2>
          <p className="text-sm text-slate-600">
            Chapter {chapterId}: {activity.chapterTitle.en} • Tier {tierId} ({tierInfo.gradeLevel})
          </p>
          <p className="text-sm text-slate-600 mt-1">
            <strong>Duration:</strong> {selectedTime} minutes ({timeVersion.breakdown}) • <strong>Budget:</strong> {budgetLabels[selectedBudget]} ({budgetInfo.costPerStudent}/student)
          </p>
        </div>

        {/* Activity Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 mb-4"
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 ${colors.bg} rounded-lg`}>
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-800">{timeVersion.activityName}</h2>
              <p className="text-sm text-slate-500 mt-1">{timeVersion.breakdown}</p>
              <p className="text-sm text-slate-600 mt-2">{activity.description[lang]}</p>
            </div>
          </div>
        </motion.div>

        {/* Materials Section */}
        <CollapsibleSection
          title="Materials Needed"
          icon={<CheckCircle size={18} />}
          expanded={expandedSections.materials}
          onToggle={() => toggleSection('materials')}
          colors={colors}
        >
          <ul className="space-y-2">
            {timeVersion.materials.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className={`mt-1 w-2 h-2 rounded-full ${colors.bg} flex-shrink-0`} />
                <span className="text-slate-700 text-sm">{item}</span>
              </li>
            ))}
          </ul>
          
          {/* Budget-specific items */}
          <div className={`mt-4 p-3 rounded-lg ${colors.border} border bg-slate-50`}>
            <p className="font-semibold text-sm text-slate-700 mb-2">
              {budgetInfo.label} ({budgetInfo.costPerStudent}/student):
            </p>
            <ul className="space-y-1">
              {budgetInfo.items.map((item, idx) => (
                <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </CollapsibleSection>

        {/* Steps Section */}
        <CollapsibleSection
          title="Step-by-Step Instructions"
          icon={<BookOpen size={18} />}
          expanded={expandedSections.steps}
          onToggle={() => toggleSection('steps')}
          colors={colors}
        >
          <ol className="space-y-4">
            {timeVersion.steps.map((step, idx) => (
              <li key={idx} className="flex gap-3">
                <div className={`flex-shrink-0 w-7 h-7 ${colors.bg} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-800">{step.title}</span>
                    <span className="text-xs px-2 py-0.5 bg-slate-100 rounded-full text-slate-500">
                      {step.duration}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </CollapsibleSection>

        {/* Discussion Questions */}
        <CollapsibleSection
          title="Discussion Questions"
          icon={<MessageCircle size={18} />}
          expanded={expandedSections.discussion}
          onToggle={() => toggleSection('discussion')}
          colors={colors}
        >
          <ul className="space-y-3">
            {timeVersion.discussionQuestions.map((question, idx) => (
              <li key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <span className={`${colors.text} font-bold`}>Q{idx + 1}</span>
                <span className="text-slate-700 text-sm">"{question}"</span>
              </li>
            ))}
          </ul>
        </CollapsibleSection>

        {/* Tier Adaptations */}
        <CollapsibleSection
          title={`Tier ${tierId} Adaptations (${tierInfo.gradeLevel})`}
          icon={<Users size={18} />}
          expanded={expandedSections.tierAdaptations}
          onToggle={() => toggleSection('tierAdaptations')}
          colors={colors}
        >
          <ul className="space-y-2">
            {tierInfo.focus.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className={`mt-1 w-2 h-2 rounded-full ${colors.bg} flex-shrink-0`} />
                <span className="text-slate-700 text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </CollapsibleSection>

        {/* Accommodations */}
        <CollapsibleSection
          title="Accommodations & Differentiation"
          icon={<Lightbulb size={18} />}
          expanded={expandedSections.accommodations}
          onToggle={() => toggleSection('accommodations')}
          colors={colors}
        >
          <div className="space-y-4">
            {Object.entries(activity.accommodations).map(([key, acc]) => (
              <div key={key} className="p-3 bg-slate-50 rounded-lg">
                <h4 className="font-semibold text-sm text-slate-800 mb-2">{acc.label}</h4>
                <ul className="space-y-1">
                  {acc.strategies.map((strategy, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                      <span className="text-slate-400">•</span>
                      {strategy}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Extension Ideas (45 min only) */}
        {selectedTime === '45' && timeVersion.extensionIdeas && (
          <CollapsibleSection
            title="Extension Ideas"
            icon={<Lightbulb size={18} />}
            expanded={expandedSections.extensionIdeas}
            onToggle={() => toggleSection('extensionIdeas')}
            colors={colors}
          >
            <ul className="space-y-2">
              {timeVersion.extensionIdeas.map((idea, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className={`mt-1 w-2 h-2 rounded-full ${colors.bg} flex-shrink-0`} />
                  <span className="text-slate-700 text-sm">{idea}</span>
                </li>
              ))}
            </ul>
          </CollapsibleSection>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center print:hidden">
          <button
            onClick={onBack}
            className={`inline-flex items-center gap-2 px-6 py-3 ${colors.bg} text-white font-semibold rounded-xl hover:opacity-90 transition-opacity`}
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}

// Collapsible Section Component
interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  colors: { bg: string; text: string; border: string };
  children: React.ReactNode;
}

function CollapsibleSection({ title, icon, expanded, onToggle, colors, children }: CollapsibleSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-4 overflow-hidden print:shadow-none print:border-slate-300 print:break-inside-avoid">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors print:hover:bg-white"
      >
        <div className="flex items-center gap-3">
          <span className={colors.text}>{icon}</span>
          <span className="font-semibold text-slate-800">{title}</span>
        </div>
        <span className="print:hidden">
          {expanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
        </span>
      </button>
      <div className={`px-4 pb-4 ${expanded ? 'block' : 'hidden'} print:block`}>
        {children}
      </div>
    </div>
  );
}