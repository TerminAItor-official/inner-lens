import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext.jsx';

// Portrait imports
import freudImg      from '../assets/philosophers/freud.jpg';
import annaFreudImg  from '../assets/philosophers/anna-freud.jpg';
import jungImg       from '../assets/philosophers/jung.jpg';
import kleinImg      from '../assets/philosophers/klein.jpg';
import lacanImg      from '../assets/philosophers/lacan.jpg';
import winnicottImg  from '../assets/philosophers/winnicott-placeholder.svg';

const PORTRAITS = {
  freud:       freudImg,
  'anna-freud': annaFreudImg,
  jung:        jungImg,
  klein:       kleinImg,
  lacan:       lacanImg,
  winnicott:   winnicottImg,
};

const fadeIn = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};

export default function PhilosopherProfile({ philosopher, onBegin, onBack }) {
  const { setPhilosopher } = useTheme();

  // Apply philosopher theme while on this screen
  useEffect(() => {
    setPhilosopher(philosopher.key);
    return () => {}; // caller handles theme reset
  }, [philosopher.key, setPhilosopher]);

  const { emoji, name, shortName, initials, tag, born, died, bio, keyConcepts, accent } = philosopher;
  const portrait = PORTRAITS[philosopher.key];
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      className="min-h-screen font-body pb-24"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}
      {...fadeIn}
    >
      {/* Top bar */}
      <div
        className="sticky top-0 z-50 px-6 py-4 flex items-center gap-4"
        style={{ backgroundColor: 'var(--bg)', borderBottom: `1px solid ${accent}22` }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 font-label text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-70"
          style={{ color: accent }}
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back
        </button>
        <span className="font-label text-[10px] uppercase tracking-[0.2em] opacity-50 ml-2">{tag}</span>
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-10">

        {/* Hero: avatar + name + dates */}
        <div className="flex items-start gap-8 mb-12">
          {/* Philosopher portrait */}
          <div className="flex-shrink-0 flex flex-col items-center gap-3">
            {portrait && !imgError ? (
              <img
                src={portrait}
                alt={name}
                onError={() => setImgError(true)}
                className="w-[120px] h-[120px] md:w-[160px] md:h-[160px] rounded-full object-cover object-top"
                style={{
                  boxShadow: `0 4px 24px ${accent}40, 0 1px 4px rgba(0,0,0,0.18)`,
                  border: `3px solid ${accent}55`,
                }}
              />
            ) : (
              <div
                className="w-[120px] h-[120px] md:w-[160px] md:h-[160px] rounded-full flex items-center justify-center font-headline text-2xl md:text-3xl"
                style={{
                  backgroundColor: `${accent}18`,
                  color: accent,
                  border: `3px solid ${accent}40`,
                  boxShadow: `0 4px 24px ${accent}30`,
                }}
              >
                {initials}
              </div>
            )}
            <div className="text-3xl">{emoji}</div>
          </div>

          {/* Name + dates + tag */}
          <div className="pt-2">
            <p
              className="font-label text-[10px] uppercase tracking-[0.25em] font-bold mb-2"
              style={{ color: accent }}
            >
              {tag}
            </p>
            <h1 className="font-headline text-3xl md:text-4xl leading-tight mb-3">
              {name}
            </h1>
            <p className="font-label text-sm opacity-50 tracking-wider">
              {born} – {died}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px mb-12" style={{ backgroundColor: `${accent}30` }} />

        {/* Bio */}
        <section className="mb-12">
          <h2
            className="font-label text-[10px] uppercase tracking-[0.25em] font-bold mb-6"
            style={{ color: accent }}
          >
            About
          </h2>
          <div className="space-y-5">
            {bio.map((paragraph, i) => (
              <p
                key={i}
                className="text-base md:text-lg leading-relaxed opacity-90"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Key concepts */}
        <section className="mb-14">
          <h2
            className="font-label text-[10px] uppercase tracking-[0.25em] font-bold mb-6"
            style={{ color: accent }}
          >
            Key Concepts
          </h2>
          <div className="flex flex-wrap gap-3">
            {keyConcepts.map((concept) => (
              <span
                key={concept}
                className="px-4 py-2 rounded-full font-label text-xs font-semibold tracking-wide"
                style={{
                  backgroundColor: `${accent}14`,
                  color: accent,
                  border: `1px solid ${accent}30`,
                }}
              >
                {concept}
              </span>
            ))}
          </div>
        </section>

        {/* CTA */}
        <button
          onClick={onBegin}
          className="w-full py-4 rounded-xl font-label text-sm font-bold uppercase tracking-widest shadow-md transition-all hover:brightness-110 active:scale-95 flex items-center justify-center gap-3"
          style={{ backgroundColor: accent, color: '#fff' }}
        >
          Begin with {shortName}
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>

        <p className="text-center font-label text-[10px] uppercase tracking-widest mt-4 opacity-40">
          AI will match you to the best guide for your entry
        </p>
      </div>
    </motion.div>
  );
}
