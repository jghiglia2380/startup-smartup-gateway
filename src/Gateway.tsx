import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Rocket,
  Users,
  ArrowRight,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface GatewayProps {
  onNavigate?: (platform: string) => void;
}

const platforms = [
  {
    id: 'explore',
    grade: 'Grades K - 4',
    title: 'Project Explore',
    tagline: 'Foundations of Literacy & SEL',
    description:
      'A video-based adventure library that builds early financial concepts and social-emotional skills through immersive literacy exercises.',
    features: [
      'Read-Along Narration',
      'Bilingual Support (EN/ES)',
      'SEL-based Storylines',
    ],
    color: 'bg-emerald-600',
    textColor: 'text-emerald-50',
    icon: <BookOpen size={48} />,
    // WIRED UP: Using one of your GitHub thumbnails as the "Hero" image for K-4
    image:
      'https://raw.githubusercontent.com/jghiglia2380/project-explore-thumbnails/main/Thumbnails/Tier%201/Ch-01-t1.jpeg',
  },
  {
    id: 'pioneer',
    grade: 'Grades 5 - 8',
    title: 'Project Pioneer',
    tagline: 'Teamwork & Project Management',
    description:
      'Transitioning from theory to practice. Students form teams to launch mock ventures, learning the fundamentals of product management and collaboration.',
    features: ['Agile for Kids', 'Team Role-Play', 'Product Design'],
    color: 'bg-rose-500',
    textColor: 'text-rose-50',
    icon: <Users size={48} />,
    // PLACEHOLDER: Need a "Middle School" style image here
    image:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 'launchpad',
    grade: 'Grades 9 - 12',
    title: 'Project Launchpad',
    tagline: 'Entrepreneurship & Career Ready',
    description:
      'The capstone experience. High schoolers build real business models, manage actual spreadsheets, and prepare for the workforce or higher education.',
    features: [
      'Business Logic',
      'Advanced Financial Literacy',
      'Career Pathways',
    ],
    color: 'bg-blue-600',
    textColor: 'text-blue-50',
    icon: <Rocket size={48} />,
    // PLACEHOLDER: Need a "High School / Career" style image here
    image:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop',
  },
];

export default function GatewayPage({ onNavigate }: GatewayProps) {
  const [activeId, setActiveId] = useState('explore');

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-slate-950 overflow-hidden font-sans">
      {/* Brand Header Overlay */}
      <div className="absolute top-0 left-0 w-full p-6 z-30 pointer-events-none mix-blend-difference text-white">
        <h1 className="text-2xl font-black tracking-tighter uppercase">
          Startup Smartup
        </h1>
        <p className="text-sm opacity-80 uppercase tracking-widest">
          The K-12 Innovation Pathway
        </p>
      </div>

      {platforms.map((platform) => {
        const isActive = activeId === platform.id;

        return (
          <motion.div
            key={platform.id}
            layout
            onClick={() => setActiveId(platform.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActiveId(platform.id);
              }
            }}
            tabIndex={0}
            role="button"
            aria-expanded={isActive}
            aria-label={`${platform.title} - ${platform.grade}`}
            className={`relative cursor-pointer overflow-hidden border-b md:border-b-0 md:border-r border-white/10 transition-all duration-700 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-inset ${
              isActive
                ? 'h-[75vh] md:h-full flex-[3]'
                : 'h-[12.5vh] md:h-full flex-[1]'
            }`}
          >
            {/* Background Image & Gradient */}
            <div className="absolute inset-0 z-0">
              {/* Color Tint Overlay */}
              <div
                className={`absolute inset-0 opacity-90 transition-colors duration-700 ${platform.color} mix-blend-multiply`}
              />

              <img
                src={platform.image}
                alt={platform.title}
                className="w-full h-full object-cover grayscale opacity-50 hover:scale-105 transition-transform duration-[2s]"
              />

              {/* Vignette for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col justify-end h-full p-8 md:p-12 pb-16">
              {/* Grade Level Tag */}
              <motion.div layout className="flex items-center gap-3 mb-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md border border-white/10 ${platform.textColor}`}
                >
                  {platform.grade}
                </span>
                {/* Horizontal line indicator when inactive */}
                {!isActive && <div className="h-[1px] w-12 bg-white/50" />}
              </motion.div>

              {/* Title Section */}
              <motion.div layout>
                <h2
                  className={`text-3xl md:text-5xl font-black mb-2 leading-none uppercase ${platform.textColor}`}
                >
                  {platform.title}
                </h2>
                <h3
                  className={`text-lg md:text-xl font-medium opacity-90 mb-4 ${platform.textColor}`}
                >
                  {platform.tagline}
                </h3>
              </motion.div>

              {/* Expanded Content (Only visible when active) */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <p
                      className={`text-base md:text-lg mb-6 max-w-lg leading-relaxed opacity-90 ${platform.textColor}`}
                    >
                      {platform.description}
                    </p>

                    <div className="flex flex-wrap gap-4 mb-8">
                      {platform.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center gap-2 text-sm font-semibold opacity-80 text-white"
                        >
                          <CheckCircle2 size={16} />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (platform.id === 'explore' && onNavigate) {
                          onNavigate('explore-dashboard');
                        }
                      }}
                      className={`flex items-center gap-3 px-8 py-4 rounded-lg font-bold shadow-2xl transition-colors ${
                        platform.id === 'explore'
                          ? 'bg-white text-slate-900 hover:bg-slate-50'
                          : 'bg-white/20 text-white border border-white/30 cursor-not-allowed'
                      }`}
                      disabled={platform.id !== 'explore'}
                    >
                      {platform.id === 'explore' ? (
                        <>
                          Enter Platform
                          <ArrowRight className="w-5 h-5" />
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          Coming Soon
                        </>
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Collapsed Icon (Only visible when inactive) */}
              {!isActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  className={`absolute bottom-12 right-12 ${platform.textColor}`}
                >
                  {platform.icon}
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
