import React from 'react';
import { motion } from 'framer-motion';

const fadeIn = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
};

export default function SavePromptScreen({ routingResult, onSignIn, onContinue }) {
  const emoji = routingResult?.philosopher_data?.emoji ?? '🌿';
  const philosopherName = routingResult?.philosopher_data?.name ?? 'your guide';

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16 font-body text-center"
      style={{ backgroundColor: '#fdf9f2', color: '#4A4541' }}
      {...fadeIn}
    >
      {/* Philosopher echo */}
      <div className="text-5xl mb-6">{emoji}</div>

      <h1 className="font-headline text-3xl md:text-4xl text-[#2F3A34] mb-3 leading-tight">
        {philosopherName} is ready for you.
      </h1>

      <div className="w-10 h-px bg-[#536252]/30 mx-auto my-6" />

      <p className="font-body text-[#434842]/70 leading-relaxed max-w-sm mb-2">
        Want to save your reflections and build a private journal over time?
      </p>
      <p className="font-body text-[#434842]/50 text-sm leading-relaxed max-w-xs mb-10">
        Sign in to keep every entry, track your streak, and watch your patterns emerge.
      </p>

      {/* Sign in CTA */}
      <button
        onClick={onSignIn}
        className="w-full max-w-xs py-4 bg-[#2F3A34] text-[#F5F1EA] rounded-xl font-label text-sm font-bold uppercase tracking-widest hover:bg-[#1A221E] transition-all shadow-md active:scale-[0.98] mb-4"
      >
        Sign in to save my reflections
      </button>

      {/* Skip */}
      <button
        onClick={onContinue}
        className="font-label text-[11px] uppercase tracking-widest text-[#747872] hover:text-[#4A4541] transition-colors"
      >
        Continue without saving →
      </button>
    </motion.div>
  );
}
