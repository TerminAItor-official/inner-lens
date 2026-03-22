import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header.jsx';
import BottomNav from '../components/BottomNav.jsx';
import philosophers from '../data/philosophers.js';

const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
};

const FALLBACK_PROMPT = { id: 'O01', text: "What's been sitting with you lately that you haven't said out loud?" };

// Short subtitle per philosopher for the compact grid cards
const subtitles = {
  freud:      'The Primal Self',
  anna_freud: 'Defense Mechanisms',
  winnicott:  'The Holding Space',
  jung:       'The Collective',
  klein:      'Internal Objects',
  lacan:      'The Mirror Stage',
};

export default function JournalEntry({ onSubmit, onHistoryClick, isPaid, onPhilosopherClick }) {
  const [prompt, setPrompt] = useState(FALLBACK_PROMPT);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/get-prompt')
      .then(r => r.json())
      .then(setPrompt)
      .catch(() => setPrompt(FALLBACK_PROMPT));
  }, []);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleSubmit = async () => {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    await onSubmit(text.trim());
    setSubmitting(false);
  };

  return (
    <motion.div className="min-h-screen pb-32 font-body" {...fadeIn}>
      <Header onHistoryClick={onHistoryClick} isPaid={isPaid} />

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto min-h-screen flex flex-col">

        {/* Prompt header */}
        <div className="mb-10">
          <span className="font-label text-xs font-bold uppercase tracking-[0.2em] text-[#6b7b6a]">
            Today's Session
          </span>
          <h1 className="mt-4 text-3xl md:text-4xl leading-tight font-headline text-[#434842]">
            {prompt.text}
          </h1>
        </div>

        {/* Textarea */}
        <div className="relative flex-grow flex flex-col group">
          <textarea
            className="w-full flex-grow bg-transparent border-none resize-none text-xl md:text-2xl leading-relaxed font-body text-[#434842] placeholder-[#c4c8c0] focus:ring-0 p-0 min-h-[200px]"
            placeholder="Write freely... there are no wrong answers."
            value={text}
            onChange={e => setText(e.target.value)}
            autoFocus
          />
          <div className="mt-4 flex justify-between items-center border-t border-[#c4c8c0]/20 pt-4">
            <div className="flex gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#ffdad5] text-[#7b534e] font-label text-[10px] font-bold uppercase tracking-wider">
                Reflection
              </span>
            </div>
            <span className="font-label text-[11px] uppercase tracking-widest text-[#747872]">
              {wordCount} {wordCount === 1 ? 'word' : 'words'}
            </span>
          </div>
        </div>

        {/* Free tier notice */}
        {!isPaid && (
          <div className="mt-10 p-5 bg-surface-container-low border-l-4 border-[#ffdad5] rounded-r-lg">
            <p className="font-label text-[11px] font-semibold text-[#536252] uppercase tracking-wider mb-1">Free Plan</p>
            <p className="text-[#434842] text-sm leading-relaxed">
              1 session per day ·{' '}
              <button className="text-[#7c544f] font-bold underline underline-offset-4 decoration-[#7c544f]/30 hover:decoration-[#7c544f]">
                Upgrade to Deep Lens
              </button>{' '}
              for AI reflections &amp; unlimited sessions.
            </p>
          </div>
        )}

        {/* Explore perspectives */}
        <div className="mt-14 mb-10">
          <h3 className="font-label text-[10px] font-bold text-[#747872] uppercase tracking-[0.2em] mb-5">
            Explore Perspectives
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {philosophers.map((philosopher) => {
              const { emoji, shortName, accent, key } = philosopher;
              return (
                <button
                  key={key}
                  onClick={() => onPhilosopherClick?.(philosopher)}
                  className="p-4 bg-surface-container-lowest shadow-sm text-left hover:brightness-95 transition-all active:scale-[0.98]"
                  style={{ borderLeft: `2px solid ${accent}` }}
                >
                  <span className="text-xl mb-2 block">{emoji}</span>
                  <p className="font-label text-[11px] font-bold text-[#1c1c18] uppercase tracking-tighter">{shortName}</p>
                  <p className="font-body text-[13px] italic text-[#747872] leading-snug">{subtitles[key]}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="sticky bottom-24 z-40">
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || submitting}
            className="w-full py-4 bg-[#2F3A34] text-[#F5F1EA] rounded-lg shadow-lg flex items-center justify-center gap-2 hover:bg-[#1A221E] transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed font-label text-sm font-bold uppercase tracking-widest"
          >
            {submitting ? 'Finding your lens...' : 'Take me to the couch'}
            {!submitting && <span className="material-symbols-outlined">arrow_forward</span>}
          </button>
        </div>
      </main>

      <BottomNav activeTab="reflect" onTabChange={() => {}} />
    </motion.div>
  );
}
