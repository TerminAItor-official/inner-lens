import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header.jsx';
import BottomNav from '../components/BottomNav.jsx';

const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
};

// Mock data shown blurred behind the paywall
const mockPatterns = [
  { label: 'Most matched thinker', value: 'Klein 🪞',    pct: 62 },
  { label: 'Top emotional theme',   value: 'Ambivalence', pct: 48 },
  { label: 'Avg. session depth',    value: '312 words',   pct: 74 },
  { label: 'Current streak',        value: '7 days',      pct: 87 },
];

const mockChartLabels = ['Thinker Breakdown', 'Mood Over Time', 'Word Patterns'];

export default function InsightsScreen({ onTabChange, onUpgradeClick, onLogoClick, isPaid }) {
  return (
    <motion.div
      className="min-h-screen pb-32 font-body"
      style={{ backgroundColor: '#fdf9f2', color: '#4A4541' }}
      {...fadeIn}
    >
      <Header isPaid={isPaid} onUpgradeClick={onUpgradeClick} onLogoClick={onLogoClick} />

      <main className="pt-28 pb-32 px-6 max-w-2xl mx-auto">
        {/* Title */}
        <div className="mb-10">
          <span className="font-label text-xs font-bold uppercase tracking-[0.2em] text-[#6b7b6a]">
            Pattern Dashboard
          </span>
          <h1 className="mt-4 text-3xl md:text-4xl leading-tight font-headline text-[#434842]">
            Your Inner Landscape
          </h1>
          <p className="mt-3 text-[#434842]/70 leading-relaxed max-w-lg">
            Over time, your sessions reveal patterns — the thinkers you return to, the emotions beneath the surface, the growth you can't yet see.
          </p>
        </div>

        {/* Locked preview */}
        <div className="relative rounded-2xl overflow-hidden border border-[#C8A96A]/30 shadow-lg">
          {/* Blurred mock content */}
          <div className="blur-sm pointer-events-none select-none p-8 space-y-5 bg-white/60">
            {mockPatterns.map(({ label, value, pct }) => (
              <div key={label}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-label text-xs uppercase tracking-wider text-[#434842]/70">{label}</span>
                  <span className="font-headline text-base text-[#2F3A34]">{value}</span>
                </div>
                <div className="h-2 rounded-full bg-[#e4e7e0]">
                  <div className="h-full rounded-full bg-[#536252]" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#c4c8c0]/20">
              {mockChartLabels.map(label => (
                <div key={label} className="text-center">
                  <div className="w-full h-20 rounded-lg bg-[#e4e7e0]/60 mb-2" />
                  <span className="font-label text-[10px] uppercase tracking-wider text-[#434842]/50">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lock overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#fdf9f2]/55 backdrop-blur-[3px] px-6">
            <div className="bg-white rounded-2xl shadow-xl px-8 py-10 text-center max-w-sm w-full">
              <span className="text-4xl mb-4 block">✨</span>
              <h2 className="font-headline text-2xl text-[#2F3A34] mb-3">Unlock Your Patterns</h2>
              <p className="font-body text-[#434842]/80 leading-relaxed text-sm mb-6">
                Upgrade to Deep Lens to see your emotional patterns, thinker history, and personal growth over time.
              </p>
              <button
                onClick={onUpgradeClick}
                className="w-full py-3.5 bg-[#C8A96A] text-[#2F3A34] rounded-lg font-label text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-md"
              >
                Upgrade to Deep Lens — $6/mo
              </button>
              <p className="mt-4 font-label text-[10px] text-[#434842]/40 uppercase tracking-widest">
                Cancel any time · No questions asked
              </p>
            </div>
          </div>
        </div>
      </main>

      <BottomNav activeTab="insights" onTabChange={onTabChange} />
    </motion.div>
  );
}
