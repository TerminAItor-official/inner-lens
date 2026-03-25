import React from 'react';
import { motion } from 'framer-motion';

const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
};

export default function PrivacyScreen({ onBack }) {
  return (
    <motion.div
      className="min-h-screen font-body flex flex-col"
      style={{ backgroundColor: '#fdf9f2', color: '#4A4541' }}
      {...fadeIn}
    >
      {/* Minimal header */}
      <header className="flex items-center justify-between px-6 py-5 border-b border-[#c4c8c0]/20">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 font-label text-[11px] uppercase tracking-widest text-[#747872] hover:text-[#4A4541] transition-colors"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back
        </button>
        <span className="font-body italic text-[#2F3A34] text-lg">Inner Lens</span>
        <div className="w-16" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center max-w-sm mx-auto">
        <span
          className="material-symbols-outlined text-5xl text-[#536252] mb-6"
          style={{ fontVariationSettings: "'FILL' 0" }}
        >
          lock
        </span>

        <h1 className="font-headline text-3xl text-[#2F3A34] mb-3">
          Privacy &amp; Data
        </h1>

        <div className="w-12 h-px bg-[#536252]/30 mx-auto mb-6" />

        <p className="font-label text-[10px] uppercase tracking-widest text-[#C8A96A] mb-4">
          Coming Soon
        </p>

        <p className="font-body text-[#434842]/70 leading-relaxed">
          Your journal entries are private by default and never used to train AI models.
          Full privacy controls — data export, deletion, and consent settings — are coming in the next release.
        </p>

        <p className="font-label text-[10px] uppercase tracking-widest text-[#434842]/40 mt-12">
          Inner Lens · Mom Words Matter™
        </p>
      </main>
    </motion.div>
  );
}
