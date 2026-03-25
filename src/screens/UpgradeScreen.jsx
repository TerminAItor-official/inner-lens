import React from 'react';
import { motion } from 'framer-motion';

const fadeIn = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};

const features = [
  'Unlimited journal sessions',
  'AI-generated personal reflection after every entry',
  'Pattern dashboard — see your emotional arc over time',
  'Export your journal as PDF',
  'All 6 psychoanalytic thinkers',
];

export default function UpgradeScreen({ onBack }) {
  return (
    <motion.div
      className="min-h-screen font-body flex flex-col"
      style={{ backgroundColor: '#fdf9f2', color: '#4A4541' }}
      {...fadeIn}
    >
      {/* Minimal header — no nav per Destination Rule */}
      <header className="flex items-center justify-between px-6 py-5 border-b border-[#c4c8c0]/20">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 font-label text-[11px] uppercase tracking-widest text-[#747872] hover:text-[#4A4541] transition-colors"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back
        </button>
        <span className="font-body italic text-[#2F3A34] text-lg">Inner Lens</span>
        <div className="w-16" /> {/* balance */}
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 max-w-lg mx-auto w-full">

        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF8EF] border border-[#C8A96A]/40">
          <span
            className="material-symbols-outlined text-sm text-[#C8A96A]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            auto_awesome
          </span>
          <span className="font-label text-[10px] uppercase tracking-widest text-[#8e6e2a]">Deep Lens</span>
        </div>

        {/* Headline */}
        <h1 className="font-headline text-4xl md:text-5xl text-[#2F3A34] text-center mb-4 leading-tight">
          Go deeper.<br />Stay honest.
        </h1>
        <p className="font-body text-[#434842]/70 text-center leading-relaxed mb-12 max-w-sm">
          Unlock the full Inner Lens experience — AI reflections, unlimited sessions, and a window into your emotional patterns over time.
        </p>

        {/* Pricing card */}
        <div className="w-full rounded-2xl border border-[#C8A96A]/30 bg-white/60 shadow-sm overflow-hidden mb-8">

          {/* Pricing options */}
          <div className="grid grid-cols-2 divide-x divide-[#C8A96A]/20">
            <div className="p-6 text-center">
              <p className="font-label text-[10px] uppercase tracking-widest text-[#747872] mb-2">Monthly</p>
              <p className="font-headline text-3xl text-[#2F3A34]">$6</p>
              <p className="font-label text-[10px] text-[#747872] mt-1">per month</p>
            </div>
            <div className="p-6 text-center relative bg-[#FDF8EF]">
              <span className="absolute top-2 right-2 font-label text-[9px] uppercase tracking-wider text-[#8e6e2a] bg-[#C8A96A]/20 px-2 py-0.5 rounded-full">
                Best value
              </span>
              <p className="font-label text-[10px] uppercase tracking-widest text-[#747872] mb-2">Annual</p>
              <p className="font-headline text-3xl text-[#2F3A34]">$49</p>
              <p className="font-label text-[10px] text-[#747872] mt-1">per year</p>
            </div>
          </div>

          {/* Feature list */}
          <div className="border-t border-[#C8A96A]/20 px-6 py-5 space-y-3">
            {features.map(f => (
              <div key={f} className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#536252] text-sm mt-0.5 flex-shrink-0">check</span>
                <span className="font-body text-sm text-[#434842]">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA — Stripe wired in Phase 2 */}
        <button
          className="w-full py-4 bg-[#2F3A34] text-[#F5F1EA] rounded-xl font-label text-sm font-bold uppercase tracking-widest hover:bg-[#1A221E] transition-all shadow-md active:scale-[0.98] mb-4"
        >
          Start 14-Day Free Trial
        </button>

        <p className="font-label text-[10px] uppercase tracking-widest text-[#434842]/40 text-center">
          Cancel any time · No questions asked
        </p>

      </main>
    </motion.div>
  );
}
